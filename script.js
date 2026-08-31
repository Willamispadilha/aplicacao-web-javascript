```javascript
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

    imoveis.forEach((imovel, index) => {
        const card = document.createElement("div");
        card.classList.add("imovel");

        card.innerHTML = `
            <h3>${imovel.tipo}</h3>
            <p><strong>Endereço:</strong> ${imovel.endereco}</p>
            <p><strong>Preço:</strong> R$ ${Number(imovel.preco).toLocaleString("pt-BR", {
                minimumFractionDigits: 2
            })}</p>
            <button class="btn-excluir" onclick="excluirImovel(${index})">
                Excluir
            </button>
        `;

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
```
