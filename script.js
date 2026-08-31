const form = document.getElementById("formImovel");
const listaImoveis = document.getElementById("listaImoveis");

let imoveis = JSON.parse(localStorage.getItem("imoveis")) || [];

function salvarImoveis() {
    localStorage.setItem("imoveis", JSON.stringify(imoveis));
}

function exibirImoveis() {
    listaImoveis.innerHTML = "";

    if (imoveis.length === 0) {
        listaImoveis.innerHTML = "<p>Nenhum imóvel cadastrado.</p>";
        return;
    }

    imoveis.forEach(function(imovel, index) {
        const card = document.createElement("div");
        card.classList.add("imovel");

        const titulo = document.createElement("h3");
        titulo.textContent = imovel.tipo;

        const endereco = document.createElement("p");
        endereco.innerHTML = "<strong>Endereço:</strong> " + imovel.endereco;

        const preco = document.createElement("p");
        preco.innerHTML = "<strong>Preço:</strong> R$ " +
            Number(imovel.preco).toLocaleString("pt-BR", {
                minimumFractionDigits: 2
            });

        const botao = document.createElement("button");
        botao.textContent = "Excluir";
        botao.classList.add("btn-excluir");

        botao.addEventListener("click", function() {
            excluirImovel(index);
        });

        card.appendChild(titulo);
        card.appendChild(endereco);
        card.appendChild(preco);
        card.appendChild(botao);

        listaImoveis.appendChild(card);
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const endereco = document.getElementById("endereco").value;
    const preco = document.getElementById("preco").value;

    const novoImovel = {
        tipo: tipo,
        endereco: endereco,
        preco: preco
    };

    imoveis.push(novoImovel);

    salvarImoveis();
    exibirImoveis();

    form.reset();

    alert("Imóvel cadastrado com sucesso!");
});

function excluirImovel(index) {
    const confirmar = confirm("Deseja realmente excluir este imóvel?");

    if (confirmar) {
        imoveis.splice(index, 1);
        salvarImoveis();
        exibirImoveis();
    }
}

exibirImoveis();
