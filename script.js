const form = document.getElementById("formImovel");
const listaImoveis = document.getElementById("listaImoveis");
const pesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtroTipo");

let imoveis = JSON.parse(localStorage.getItem("imoveis")) || [];

let indiceEdicao = -1;

function salvarImoveis() {
    localStorage.setItem("imoveis", JSON.stringify(imoveis));
}

function exibirImoveis() {
    listaImoveis.innerHTML = "";

    const textoPesquisa = pesquisa.value.trim().toLowerCase();
    const tipoSelecionado = filtroTipo.value.toLowerCase();

    const imoveisFiltrados = imoveis.filter(function(imovel) {
        const tipo = String(imovel.tipo || "").toLowerCase();
        const endereco = String(imovel.endereco || "").toLowerCase();

        const correspondePesquisa =
            tipo.includes(textoPesquisa) ||
            endereco.includes(textoPesquisa);

        const correspondeTipo =
            tipoSelecionado === "" ||
            tipo === tipoSelecionado;

        return correspondePesquisa && correspondeTipo;
    });

    if (imoveisFiltrados.length === 0) {
        listaImoveis.innerHTML = "<p>Nenhum imóvel encontrado.</p>";
        return;
    }

    imoveisFiltrados.forEach(function(imovel) {
        const index = imoveis.indexOf(imovel);

        const card = document.createElement("div");
        card.classList.add("imovel");

        const titulo = document.createElement("h3");
        titulo.textContent = imovel.tipo;

        const endereco = document.createElement("p");
        endereco.innerHTML =
            "<strong>Endereço:</strong> " + imovel.endereco;

        const preco = document.createElement("p");
        preco.innerHTML =
            "<strong>Preço:</strong> R$ " +
            Number(imovel.preco).toLocaleString("pt-BR", {
                minimumFractionDigits: 2
            });

        const botoes = document.createElement("div");
        botoes.classList.add("botoes");

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.classList.add("btn-editar");

        botaoEditar.addEventListener("click", function() {
            editarImovel(index);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.classList.add("btn-excluir");

        botaoExcluir.addEventListener("click", function() {
            excluirImovel(index);
        });

        botoes.appendChild(botaoEditar);
        botoes.appendChild(botaoExcluir);

        card.appendChild(titulo);
        card.appendChild(endereco);
        card.appendChild(preco);
        card.appendChild(botoes);

        listaImoveis.appendChild(card);
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const endereco = document.getElementById("endereco").value.trim();
    const preco = document.getElementById("preco").value;

    if (!tipo || !endereco || !preco) {
        alert("Preencha todos os campos.");
        return;
    }

    const imovelAtualizado = {
        tipo: tipo,
        endereco: endereco,
        preco: preco
    };

    if (indiceEdicao === -1) {
        imoveis.push(imovelAtualizado);
        alert("Imóvel cadastrado com sucesso!");
    } else {
        imoveis[indiceEdicao] = imovelAtualizado;
        indiceEdicao = -1;

        form.querySelector("button[type='submit']").textContent =
            "Cadastrar imóvel";

        alert("Imóvel atualizado com sucesso!");
    }

    salvarImoveis();

    form.reset();

    exibirImoveis();
});

function editarImovel(index) {
    const imovel = imoveis[index];

    document.getElementById("tipo").value = imovel.tipo;
    document.getElementById("endereco").value = imovel.endereco;
    document.getElementById("preco").value = imovel.preco;

    indiceEdicao = index;

    form.querySelector("button[type='submit']").textContent =
        "Salvar alteração";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function excluirImovel(index) {
    const confirmar = confirm(
        "Deseja realmente excluir este imóvel?"
    );

    if (confirmar) {
        imoveis.splice(index, 1);

        salvarImoveis();
        exibirImoveis();

        alert("Imóvel excluído com sucesso!");
    }
}

pesquisa.addEventListener("input", function() {
    exibirImoveis();
});

filtroTipo.addEventListener("change", function() {
    exibirImoveis();
});

exibirImoveis();
