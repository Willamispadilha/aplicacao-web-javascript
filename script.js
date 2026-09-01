```javascript
// ======================================================
// IMÓVEIS FÁCIL - SCRIPT COMPLETO
// Cadastro, pesquisa, filtros, edição, exclusão,
// fotos, foto principal e foto ampliada
// ======================================================

const form = document.getElementById("formImovel");
const listaImoveis = document.getElementById("listaImoveis");
const pesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtroTipo");

const campoFotos = document.getElementById("fotos");
const previewFotos = document.getElementById("previewFotos");

const modalFoto = document.getElementById("modalFoto");
const fotoAmpliada = document.getElementById("fotoAmpliada");

let imoveis = JSON.parse(localStorage.getItem("imoveis")) || [];

let fotosSelecionadas = [];
let fotoPrincipalIndex = 0;
let indiceEdicao = null;


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    renderizarImoveis();
    atualizarPreviewFotos();
});


// ======================================================
// SELEÇÃO DE FOTOS
// ======================================================

campoFotos.addEventListener("change", function () {

    const arquivos = Array.from(this.files);

    arquivos.forEach((arquivo) => {

        const leitor = new FileReader();

        leitor.onload = function (evento) {

            fotosSelecionadas.push(evento.target.result);

            // Se for a primeira foto, ela será principal
            if (fotosSelecionadas.length === 1) {
                fotoPrincipalIndex = 0;
            }

            atualizarPreviewFotos();
        };

        leitor.readAsDataURL(arquivo);
    });

    // Permite selecionar novamente o mesmo arquivo
    this.value = "";
});


// ======================================================
// MOSTRAR PREVIEW DAS FOTOS
// ======================================================

function atualizarPreviewFotos() {

    previewFotos.innerHTML = "";

    if (fotosSelecionadas.length === 0) {
        previewFotos.innerHTML =
            '<p class="sem-fotos">Nenhuma foto selecionada.</p>';
        return;
    }

    fotosSelecionadas.forEach((foto, index) => {

        const container = document.createElement("div");

        container.className = "foto-preview-item";

        if (index === fotoPrincipalIndex) {
            container.classList.add("foto-principal");
        }

        container.innerHTML = `
            <img 
                src="${foto}" 
                alt="Foto ${index + 1}"
                onclick="abrirFoto('${foto}')"
            >

            <div class="acoes-foto">

                <button 
                    type="button"
                    class="btn-principal"
                    onclick="definirFotoPrincipal(${index})"
                    title="Definir como foto principal"
                >
                    ${index === fotoPrincipalIndex ? "⭐ Principal" : "☆ Principal"}
                </button>

                <button 
                    type="button"
                    class="btn-excluir-foto"
                    onclick="excluirFoto(${index})"
                    title="Excluir foto"
                >
                    🗑️ Excluir
                </button>

            </div>
        `;

        previewFotos.appendChild(container);
    });
}


// ======================================================
// DEFINIR FOTO PRINCIPAL
// ======================================================

function definirFotoPrincipal(index) {

    if (index < 0 || index >= fotosSelecionadas.length) {
        return;
    }

    fotoPrincipalIndex = index;

    atualizarPreviewFotos();
}


// ======================================================
// EXCLUIR FOTO
// ======================================================

function excluirFoto(index) {

    if (index < 0 || index >= fotosSelecionadas.length) {
        return;
    }

    const eraPrincipal = index === fotoPrincipalIndex;

    fotosSelecionadas.splice(index, 1);

    // Não existem mais fotos
    if (fotosSelecionadas.length === 0) {
        fotoPrincipalIndex = 0;
    }

    // Se excluiu a principal
    else if (eraPrincipal) {

        // A próxima foto vira principal.
        // Se não existir próxima, usa a anterior.
        if (index < fotosSelecionadas.length) {
            fotoPrincipalIndex = index;
        } else {
            fotoPrincipalIndex = fotosSelecionadas.length - 1;
        }
    }

    // Se excluiu uma foto antes da principal,
    // precisamos ajustar o índice.
    else if (index < fotoPrincipalIndex) {
        fotoPrincipalIndex--;
    }

    atualizarPreviewFotos();
}


// ======================================================
// FORMULÁRIO - CADASTRAR / EDITAR
// ======================================================

form.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const endereco = document.getElementById("endereco").value;
    const preco = document.getElementById("preco").value;
    const quartos = document.getElementById("quartos").value;
    const banheiros = document.getElementById("banheiros").value;
    const vagas = document.getElementById("vagas").value;
    const area = document.getElementById("area").value;
    const descricao = document.getElementById("descricao").value;

    // Cria o objeto do imóvel
    const imovel = {
        tipo: tipo,
        endereco: endereco,
        preco: preco,
        quartos: quartos,
        banheiros: banheiros,
        vagas: vagas,
        area: area,
        descricao: descricao,
        fotos: [...fotosSelecionadas],
        fotoPrincipal: fotoPrincipalIndex
    };


    // ==================================================
    // EDIÇÃO
    // ==================================================

    if (indiceEdicao !== null) {

        imoveis[indiceEdicao] = imovel;

        indiceEdicao = null;

        const botao = form.querySelector('button[type="submit"]');

        if (botao) {
            botao.textContent = "Cadastrar imóvel";
        }

    }

    // ==================================================
    // NOVO CADASTRO
    // ==================================================

    else {

        imoveis.push(imovel);

    }


    salvarImoveis();

    form.reset();

    fotosSelecionadas = [];
    fotoPrincipalIndex = 0;

    atualizarPreviewFotos();

    renderizarImoveis();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// ======================================================
// SALVAR NO LOCALSTORAGE
// ======================================================

function salvarImoveis() {

    localStorage.setItem(
        "imoveis",
        JSON.stringify(imoveis)
    );
}


// ======================================================
// RENDERIZAR IMÓVEIS
// ======================================================

function renderizarImoveis() {

    listaImoveis.innerHTML = "";

    const termoPesquisa =
        pesquisa.value.toLowerCase().trim();

    const tipoSelecionado =
        filtroTipo.value;


    const imoveisFiltrados = imoveis.filter((imovel) => {

        const correspondePesquisa =
            imovel.endereco
                .toLowerCase()
                .includes(termoPesquisa);

        const correspondeTipo =
            tipoSelecionado === "" ||
            imovel.tipo === tipoSelecionado;

        return correspondePesquisa && correspondeTipo;
    });


    if (imoveisFiltrados.length === 0) {

        listaImoveis.innerHTML = `
            <div class="nenhum-imovel">
                <p>Nenhum imóvel encontrado.</p>
            </div>
        `;

        return;
    }


    imoveisFiltrados.forEach((imovel) => {

        // Descobre o índice real no array original
        const indiceReal = imoveis.indexOf(imovel);

        criarCardImovel(imovel, indiceReal);
    });
}


// ======================================================
// CRIAR CARD DO IMÓVEL
// ======================================================

function criarCardImovel(imovel, indice) {

    const card = document.createElement("div");

    card.className = "card-imovel";


    // ==================================================
    // FOTO PRINCIPAL
    // ==================================================

    let fotoPrincipal = "";

    if (imovel.fotos && imovel.fotos.length > 0) {

        let indicePrincipal =
            Number.isInteger(imovel.fotoPrincipal)
                ? imovel.fotoPrincipal
                : 0;

        // Proteção contra índice inválido
        if (
            indicePrincipal < 0 ||
            indicePrincipal >= imovel.fotos.length
        ) {
            indicePrincipal = 0;
        }

        fotoPrincipal =
            imovel.fotos[indicePrincipal];
    }


    // ==================================================
    // HTML DO CARD
    // ==================================================

    card.innerHTML = `

        <div class="imagem-imovel">

            ${
                fotoPrincipal
                    ? `
                        <img 
                            src="${fotoPrincipal}"
                            alt="Foto do imóvel"
                            onclick="abrirFoto('${fotoPrincipal}')"
                        >
                      `
                    : `
                        <div class="sem-imagem">
                            🏠
                            <span>Sem foto</span>
                        </div>
                      `
            }

        </div>


        <div class="info-imovel">

            <h3>
                ${imovel.tipo || "Imóvel"}
            </h3>

            <p class="endereco">
                📍 ${imovel.endereco || "Endereço não informado"}
            </p>

            ${
                imovel.preco
                    ? `
                        <p class="preco">
                            💰 R$ ${formatarPreco(imovel.preco)}
                        </p>
                      `
                    : ""
            }


            <div class="detalhes-imovel">

                ${
                    imovel.quartos
                        ? `<span>🛏️ ${imovel.quartos} quartos</span>`
                        : ""
                }

                ${
                    imovel.banheiros
                        ? `<span>🚿 ${imovel.banheiros} banheiros</span>`
                        : ""
                }

                ${
                    imovel.vagas
                        ? `<span>🚗 ${imovel.vagas} vagas</span>`
                        : ""
                }

                ${
                    imovel.area
                        ? `<span>📐 ${imovel.area} m²</span>`
                        : ""
                }

            </div>


            ${
                imovel.descricao
                    ? `
                        <p class="descricao">
                            ${imovel.descricao}
                        </p>
                      `
                    : ""
            }


            ${
                imovel.fotos && imovel.fotos.length > 1
                    ? `
                        <div class="miniaturas">

                            ${imovel.fotos
                                .map((foto, fotoIndex) => {

                                    const principal =
                                        fotoIndex ===
                                        Number(imovel.fotoPrincipal || 0);

                                    return `
                                        <div
                                            class="miniatura ${
                                                principal
                                                    ? "miniatura-principal"
                                                    : ""
                                            }"
                                            onclick="abrirFoto('${foto}')"
                                        >
                                            <img
                                                src="${foto}"
                                                alt="Foto ${fotoIndex + 1}"
                                            >

                                            ${
                                                principal
                                                    ? `<span>⭐</span>`
                                                    : ""
                                            }
                                        </div>
                                    `;
                                })
                                .join("")}

                        </div>
                      `
                    : ""
            }


            <div class="acoes-imovel">

                <button
                    type="button"
                    class="btn-editar"
                    onclick="editarImovel(${indice})"
                >
                    ✏️ Editar
                </button>


                <button
                    type="button"
                    class="btn-excluir"
                    onclick="excluirImovel(${indice})"
                >
                    🗑️ Excluir
                </button>

            </div>

        </div>
    `;


    listaImoveis.appendChild(card);
}


// ======================================================
// EDITAR IMÓVEL
// ======================================================

function editarImovel(index) {

    const imovel = imoveis[index];

    if (!imovel) {
        return;
    }


    document.getElementById("tipo").value =
        imovel.tipo || "";

    document.getElementById("endereco").value =
        imovel.endereco || "";

    document.getElementById("preco").value =
        imovel.preco || "";

    document.getElementById("quartos").value =
        imovel.quartos || "";

    document.getElementById("banheiros").value =
        imovel.banheiros || "";

    document.getElementById("vagas").value =
        imovel.vagas || "";

    document.getElementById("area").value =
        imovel.area || "";

    document.getElementById("descricao").value =
        imovel.descricao || "";


    // Recupera as fotos
    fotosSelecionadas =
        Array.isArray(imovel.fotos)
            ? [...imovel.fotos]
            : [];


    // Recupera foto principal
    fotoPrincipalIndex =
        Number.isInteger(imovel.fotoPrincipal)
            ? imovel.fotoPrincipal
            : 0;


    // Proteção
    if (
        fotosSelecionadas.length === 0 ||
        fotoPrincipalIndex < 0 ||
        fotoPrincipalIndex >= fotosSelecionadas.length
    ) {
        fotoPrincipalIndex = 0;
    }


    indiceEdicao = index;


    atualizarPreviewFotos();


    const botao =
        form.querySelector('button[type="submit"]');

    if (botao) {
        botao.textContent = "Salvar alterações";
    }


    // Rola até o formulário
    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ======================================================
// EXCLUIR IMÓVEL
// ======================================================

function excluirImovel(index) {

    const imovel = imoveis[index];

    if (!imovel) {
        return;
    }


    const confirmar = confirm(
        `Deseja realmente excluir o imóvel "${imovel.endereco}"?`
    );


    if (!confirmar) {
        return;
    }


    imoveis.splice(index, 1);

    salvarImoveis();

    renderizarImoveis();
}


// ======================================================
// PESQUISA
// ======================================================

pesquisa.addEventListener("input", () => {
    renderizarImoveis();
});


// ======================================================
// FILTRO POR TIPO
// ======================================================

filtroTipo.addEventListener("change", () => {
    renderizarImoveis();
});


// ======================================================
// FORMATAR PREÇO
// ======================================================

function formatarPreco(valor) {

    if (!valor) {
        return "";
    }

    const numero =
        Number(
            String(valor)
                .replace(/\./g, "")
                .replace(",", ".")
        );

    if (isNaN(numero)) {
        return valor;
    }

    return numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// ======================================================
// ABRIR FOTO AMPLIADA
// ======================================================

function abrirFoto(foto) {

    if (!foto) {
        return;
    }

    fotoAmpliada.src = foto;

    modalFoto.style.display = "flex";
}


// ======================================================
// FECHAR FOTO AMPLIADA
// ======================================================

function fecharFoto() {

    modalFoto.style.display = "none";

    fotoAmpliada.src = "";
}


// ======================================================
// FECHAR CLICANDO FORA DA FOTO
// ======================================================

if (modalFoto) {

    modalFoto.addEventListener("click", function (evento) {

        if (evento.target === modalFoto) {
            fecharFoto();
        }

    });
}


// ======================================================
// FECHAR COM ESC
// ======================================================

document.addEventListener("keydown", function (evento) {

    if (
        evento.key === "Escape" &&
        modalFoto.style.display === "flex"
    ) {
        fecharFoto();
    }

});
```
