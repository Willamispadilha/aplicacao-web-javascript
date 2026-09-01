```javascript
// ======================================================
// IMÓVEIS FÁCIL
// Versão completa e corrigida
// ======================================================

const form = document.getElementById("formImovel");
const listaImoveis = document.getElementById("listaImoveis");
const pesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtroTipo");

const campoFotos = document.getElementById("fotos");
const previewFotos = document.getElementById("previewFotos");

const modalFoto = document.getElementById("modalFoto");
const fotoAmpliada = document.getElementById("fotoAmpliada");


// ======================================================
// VARIÁVEIS
// ======================================================

let imoveis = [];

let fotosSelecionadas = [];

let fotoPrincipalIndex = 0;

let indiceEdicao = null;


// ======================================================
// CARREGAR IMÓVEIS
// ======================================================

function carregarImoveis() {

    try {

        const dados = localStorage.getItem("imoveis");

        if (!dados) {
            imoveis = [];
            return;
        }

        const dadosConvertidos = JSON.parse(dados);

        if (Array.isArray(dadosConvertidos)) {
            imoveis = dadosConvertidos;
        } else {
            imoveis = [];
        }

    } catch (erro) {

        console.error("Erro ao carregar imóveis:", erro);

        imoveis = [];
    }
}


// ======================================================
// SALVAR IMÓVEIS
// ======================================================

function salvarImoveis() {

    try {

        localStorage.setItem(
            "imoveis",
            JSON.stringify(imoveis)
        );

    } catch (erro) {

        console.error("Erro ao salvar imóveis:", erro);

        alert(
            "Não foi possível salvar os dados. " +
            "O armazenamento do navegador pode estar cheio."
        );
    }
}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    carregarImoveis();

    renderizarImoveis();

    atualizarPreviewFotos();

});


// ======================================================
// SELEÇÃO DE FOTOS
// ======================================================

if (campoFotos) {

    campoFotos.addEventListener("change", function () {

        const arquivos = Array.from(this.files);

        if (arquivos.length === 0) {
            return;
        }


        arquivos.forEach(function (arquivo) {

            if (!arquivo.type.startsWith("image/")) {

                alert(
                    "O arquivo " +
                    arquivo.name +
                    " não é uma imagem."
                );

                return;
            }


            const leitor = new FileReader();


            leitor.onload = function (evento) {

                fotosSelecionadas.push(
                    evento.target.result
                );


                // Se ainda não havia foto,
                // a primeira vira principal.
                if (fotosSelecionadas.length === 1) {

                    fotoPrincipalIndex = 0;

                }


                atualizarPreviewFotos();

            };


            leitor.onerror = function () {

                console.error(
                    "Erro ao carregar a foto:",
                    arquivo.name
                );

            };


            leitor.readAsDataURL(arquivo);

        });


        // Permite selecionar novamente
        // a mesma foto depois.
        this.value = "";

    });

}


// ======================================================
// PREVIEW DAS FOTOS
// ======================================================

function atualizarPreviewFotos() {

    if (!previewFotos) {
        return;
    }


    previewFotos.innerHTML = "";


    if (fotosSelecionadas.length === 0) {

        previewFotos.innerHTML =
            '<p class="sem-fotos">Nenhuma foto selecionada.</p>';

        return;
    }


    fotosSelecionadas.forEach(function (foto, index) {

        const container =
            document.createElement("div");


        container.className =
            "foto-preview-item";


        if (index === fotoPrincipalIndex) {

            container.classList.add(
                "foto-principal"
            );

        }


        // ==================================================
        // IMAGEM
        // ==================================================

        const imagem =
            document.createElement("img");


        imagem.src = foto;

        imagem.alt =
            "Foto " + (index + 1);


        imagem.addEventListener(
            "click",
            function () {

                abrirFoto(foto);

            }
        );


        // ==================================================
        // ÁREA DE AÇÕES
        // ==================================================

        const acoes =
            document.createElement("div");


        acoes.className =
            "acoes-foto";


        // ==================================================
        // BOTÃO PRINCIPAL
        // ==================================================

        const botaoPrincipal =
            document.createElement("button");


        botaoPrincipal.type =
            "button";


        botaoPrincipal.className =
            "btn-principal";


        botaoPrincipal.textContent =
            index === fotoPrincipalIndex
                ? "⭐ Principal"
                : "☆ Principal";


        botaoPrincipal.title =
            "Definir esta foto como principal";


        botaoPrincipal.addEventListener(
            "click",
            function (evento) {

                evento.preventDefault();

                evento.stopPropagation();

                definirFotoPrincipal(index);

            }
        );


        // ==================================================
        // BOTÃO EXCLUIR
        // ==================================================

        const botaoExcluir =
            document.createElement("button");


        botaoExcluir.type =
            "button";


        botaoExcluir.className =
            "btn-excluir-foto";


        botaoExcluir.textContent =
            "🗑️ Excluir";


        botaoExcluir.title =
            "Excluir esta foto";


        botaoExcluir.addEventListener(
            "click",
            function (evento) {

                evento.preventDefault();

                evento.stopPropagation();

                excluirFoto(index);

            }
        );


        // ==================================================
        // MONTAR
        // ==================================================

        acoes.appendChild(
            botaoPrincipal
        );

        acoes.appendChild(
            botaoExcluir
        );


        container.appendChild(
            imagem
        );

        container.appendChild(
            acoes
        );


        previewFotos.appendChild(
            container
        );

    });

}


// ======================================================
// DEFINIR FOTO PRINCIPAL
// ======================================================

function definirFotoPrincipal(index) {

    if (
        index < 0 ||
        index >= fotosSelecionadas.length
    ) {
        return;
    }


    fotoPrincipalIndex = index;


    atualizarPreviewFotos();

}


// ======================================================
// EXCLUIR FOTO
// ======================================================

function excluirFoto(index) {

    if (
        index < 0 ||
        index >= fotosSelecionadas.length
    ) {
        return;
    }


    const eraPrincipal =
        index === fotoPrincipalIndex;


    // Remove somente a foto escolhida
    fotosSelecionadas.splice(index, 1);


    // ==================================================
    // SEM FOTOS
    // ==================================================

    if (fotosSelecionadas.length === 0) {

        fotoPrincipalIndex = 0;

    }


    // ==================================================
    // EXCLUIU A PRINCIPAL
    // ==================================================

    else if (eraPrincipal) {

        /*
         * Depois da remoção:
         *
         * Foto 1 ⭐
         * Foto 2
         * Foto 3
         *
         * Se Foto 1 for excluída,
         * Foto 2 passa a ser principal.
         */

        if (
            index < fotosSelecionadas.length
        ) {

            fotoPrincipalIndex = index;

        } else {

            fotoPrincipalIndex =
                fotosSelecionadas.length - 1;

        }

    }


    // ==================================================
    // EXCLUIU UMA FOTO ANTES DA PRINCIPAL
    // ==================================================

    else if (
        index < fotoPrincipalIndex
    ) {

        fotoPrincipalIndex--;

    }


    atualizarPreviewFotos();

}


// ======================================================
// CADASTRAR / EDITAR
// ======================================================

if (form) {

    form.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            // ==================================================
            // PEGAR CAMPOS
            // ==================================================

            const tipo =
                document.getElementById("tipo")?.value || "";


            const endereco =
                document.getElementById("endereco")?.value || "";


            const preco =
                document.getElementById("preco")?.value || "";


            const quartos =
                document.getElementById("quartos")?.value || "";


            const banheiros =
                document.getElementById("banheiros")?.value || "";


            const vagas =
                document.getElementById("vagas")?.value || "";


            const area =
                document.getElementById("area")?.value || "";


            const descricao =
                document.getElementById("descricao")?.value || "";


            // ==================================================
            // CORRIGIR ÍNDICE DA FOTO PRINCIPAL
            // ==================================================

            if (
                fotosSelecionadas.length === 0
            ) {

                fotoPrincipalIndex = 0;

            }
            else if (
                fotoPrincipalIndex < 0 ||
                fotoPrincipalIndex >= fotosSelecionadas.length
            ) {

                fotoPrincipalIndex = 0;

            }


            // ==================================================
            // CRIAR IMÓVEL
            // ==================================================

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

                fotoPrincipal:
                    fotoPrincipalIndex

            };


            // ==================================================
            // EDITAR
            // ==================================================

            if (indiceEdicao !== null) {

                imoveis[indiceEdicao] =
                    imovel;

                indiceEdicao = null;


                alterarTextoBotao(
                    "Cadastrar imóvel"
                );

            }


            // ==================================================
            // NOVO IMÓVEL
            // ==================================================

            else {

                imoveis.push(
                    imovel
                );

            }


            // ==================================================
            // SALVAR
            // ==================================================

            salvarImoveis();


            // ==================================================
            // LIMPAR FORMULÁRIO
            // ==================================================

            form.reset();


            fotosSelecionadas = [];

            fotoPrincipalIndex = 0;


            atualizarPreviewFotos();


            // ==================================================
            // ATUALIZAR LISTA
            // ==================================================

            renderizarImoveis();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// ======================================================
// ALTERAR TEXTO DO BOTÃO
// ======================================================

function alterarTextoBotao(texto) {

    if (!form) {
        return;
    }


    const botao =
        form.querySelector(
            'button[type="submit"]'
        );


    if (botao) {

        botao.textContent =
            texto;

    }

}


// ======================================================
// RENDERIZAR IMÓVEIS
// ======================================================

function renderizarImoveis() {

    if (!listaImoveis) {
        return;
    }


    listaImoveis.innerHTML = "";


    const termo =
        pesquisa
            ? pesquisa.value.toLowerCase().trim()
            : "";


    const tipoSelecionado =
        filtroTipo
            ? filtroTipo.value
            : "";


    const encontrados =
        imoveis.filter(
            function (imovel) {

                const endereco =
                    String(
                        imovel.endereco || ""
                    ).toLowerCase();


                const tipo =
                    String(
                        imovel.tipo || ""
                    );


                const correspondePesquisa =
                    endereco.includes(
                        termo
                    );


                const correspondeTipo =
                    tipoSelecionado === "" ||
                    tipo === tipoSelecionado;


                return (
                    correspondePesquisa &&
                    correspondeTipo
                );

            }
        );


    // ==================================================
    // NENHUM IMÓVEL
    // ==================================================

    if (encontrados.length === 0) {

        listaImoveis.innerHTML = `
            <div class="nenhum-imovel">
                <p>Nenhum imóvel encontrado.</p>
            </div>
        `;

        return;
    }


    // ==================================================
    // CRIAR CARDS
    // ==================================================

    encontrados.forEach(
        function (imovel) {

            const indice =
                imoveis.indexOf(imovel);


            criarCardImovel(
                imovel,
                indice
            );

        }
    );

}


// ======================================================
// CRIAR CARD
// ======================================================

function criarCardImovel(
    imovel,
    indice
) {

    const card =
        document.createElement("div");


    card.className =
        "card-imovel";


    // ==================================================
    // FOTOS
    // ==================================================

    let fotos =
        Array.isArray(imovel.fotos)
            ? imovel.fotos
            : [];


    let principal =
        Number(imovel.fotoPrincipal);


    if (
        !Number.isInteger(principal) ||
        principal < 0 ||
        principal >= fotos.length
    ) {

        principal = 0;

    }


    const fotoPrincipal =
        fotos.length > 0
            ? fotos[principal]
            : "";


    // ==================================================
    // ÁREA DA FOTO PRINCIPAL
    // ==================================================

    let htmlFoto =
        "";


    if (fotoPrincipal) {

        htmlFoto = `
            <img
                class="imagem-principal-card"
                src="${fotoPrincipal}"
                alt="Foto principal do imóvel"
            >
        `;

    }
    else {

        htmlFoto = `
            <div class="sem-imagem">
                🏠
                <span>Sem foto</span>
            </div>
        `;

    }


    // ==================================================
    // INFORMAÇÕES
    // ==================================================

    let htmlDetalhes = "";


    if (imovel.quartos) {

        htmlDetalhes +=
            `<span>🛏️ ${imovel.quartos} quartos</span>`;

    }


    if (imovel.banheiros) {

        htmlDetalhes +=
            `<span>🚿 ${imovel.banheiros} banheiros</span>`;

    }


    if (imovel.vagas) {

        htmlDetalhes +=
            `<span>🚗 ${imovel.vagas} vagas</span>`;

    }


    if (imovel.area) {

        htmlDetalhes +=
            `<span>📐 ${imovel.area} m²</span>`;

    }


    // ==================================================
    // MINIATURAS
    // ==================================================

    let htmlMiniaturas = "";


    if (fotos.length > 1) {

        htmlMiniaturas =
            `<div class="miniaturas">`;


        fotos.forEach(
            function (foto, fotoIndex) {

                const classePrincipal =
                    fotoIndex === principal
                        ? "miniatura-principal"
                        : "";


                htmlMiniaturas += `

                    <div
                        class="miniatura ${classePrincipal}"
                        data-foto-index="${fotoIndex}"
                    >

                        <img
                            src="${foto}"
                            alt="Foto ${fotoIndex + 1}"
                        >

                        ${
                            fotoIndex === principal
                                ? `<span>⭐</span>`
                                : ""
                        }

                    </div>

                `;

            }
        );


        htmlMiniaturas +=
            `</div>`;

    }


    // ==================================================
    // HTML CARD
    // ==================================================

    card.innerHTML = `

        <div class="imagem-imovel">

            ${htmlFoto}

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


            ${
                htmlDetalhes
                    ? `
                        <div class="detalhes-imovel">
                            ${htmlDetalhes}
                        </div>
                    `
                    : ""
            }


            ${
                imovel.descricao
                    ? `
                        <p class="descricao">
                            ${imovel.descricao}
                        </p>
                    `
                    : ""
            }


            ${htmlMiniaturas}


            <div class="acoes-imovel">

                <button
                    type="button"
                    class="btn-editar"
                    data-editar="${indice}"
                >
                    ✏️ Editar
                </button>


                <button
                    type="button"
                    class="btn-excluir"
                    data-excluir="${indice}"
                >
                    🗑️ Excluir
                </button>

            </div>

        </div>

    `;


    // ==================================================
    // FOTO PRINCIPAL
    // ==================================================

    const imagemCard =
        card.querySelector(
            ".imagem-principal-card"
        );


    if (imagemCard) {

        imagemCard.addEventListener(
            "click",
            function () {

                abrirFoto(
                    fotoPrincipal
                );

            }
        );

    }


    // ==================================================
    // MINIATURAS
    // ==================================================

    const miniaturas =
        card.querySelectorAll(
            ".miniatura"
        );


    miniaturas.forEach(
        function (miniatura) {

            const fotoIndex =
                Number(
                    miniatura.dataset.fotoIndex
                );


            miniatura.addEventListener(
                "click",
                function () {

                    if (
                        fotos[fotoIndex]
                    ) {

                        abrirFoto(
                            fotos[fotoIndex]
                        );

                    }

                }
            );

        }
    );


    // ==================================================
    // BOTÃO EDITAR
    // ==================================================

    const botaoEditar =
        card.querySelector(
            "[data-editar]"
        );


    if (botaoEditar) {

        botaoEditar.addEventListener(
            "click",
            function () {

                editarImovel(
                    Number(
                        this.dataset.editar
                    )
                );

            }
        );

    }


    // ==================================================
    // BOTÃO EXCLUIR
    // ==================================================

    const botaoExcluir =
        card.querySelector(
            "[data-excluir]"
        );


    if (botaoExcluir) {

        botaoExcluir.addEventListener(
            "click",
            function () {

                excluirImovel(
                    Number(
                        this.dataset.excluir
                    )
                );

            }
        );

    }


    listaImoveis.appendChild(
        card
    );

}


// ======================================================
// EDITAR IMÓVEL
// ======================================================

function editarImovel(index) {

    const imovel =
        imoveis[index];


    if (!imovel) {

        return;

    }


    // ==================================================
    // PREENCHER CAMPOS
    // ==================================================

    const campoTipo =
        document.getElementById("tipo");

    const campoEndereco =
        document.getElementById("endereco");

    const campoPreco =
        document.getElementById("preco");

    const campoQuartos =
        document.getElementById("quartos");

    const campoBanheiros =
        document.getElementById("banheiros");

    const campoVagas =
        document.getElementById("vagas");

    const campoArea =
        document.getElementById("area");

    const campoDescricao =
        document.getElementById("descricao");


    if (campoTipo)
        campoTipo.value =
            imovel.tipo || "";


    if (campoEndereco)
        campoEndereco.value =
            imovel.endereco || "";


    if (campoPreco)
        campoPreco.value =
            imovel.preco || "";


    if (campoQuartos)
        campoQuartos.value =
            imovel.quartos || "";


    if (campoBanheiros)
        campoBanheiros.value =
            imovel.banheiros || "";


    if (campoVagas)
        campoVagas.value =
            imovel.vagas || "";


    if (campoArea)
        campoArea.value =
            imovel.area || "";


    if (campoDescricao)
        campoDescricao.value =
            imovel.descricao || "";


    // ==================================================
    // CARREGAR FOTOS
    // ==================================================

    fotosSelecionadas =
        Array.isArray(imovel.fotos)
            ? [...imovel.fotos]
            : [];


    // ==================================================
    // CARREGAR FOTO PRINCIPAL
    // ==================================================

    fotoPrincipalIndex =
        Number(imovel.fotoPrincipal);


    if (
        !Number.isInteger(
            fotoPrincipalIndex
        ) ||
        fotoPrincipalIndex < 0 ||
        fotoPrincipalIndex >= fotosSelecionadas.length
    ) {

        fotoPrincipalIndex = 0;

    }


    indiceEdicao =
        index;


    atualizarPreviewFotos();


    alterarTextoBotao(
        "Salvar alterações"
    );


    // ==================================================
    // IR PARA O FORMULÁRIO
    // ==================================================

    if (form) {

        form.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}


// ======================================================
// EXCLUIR IMÓVEL
// ======================================================

function excluirImovel(index) {

    const imovel =
        imoveis[index];


    if (!imovel) {

        return;

    }


    const endereco =
        imovel.endereco ||
        "este imóvel";


    const confirmar =
        confirm(
            `Deseja realmente excluir ${endereco}?`
        );


    if (!confirmar) {

        return;

    }


    imoveis.splice(
        index,
        1
    );


    salvarImoveis();


    // Se estava editando este imóvel
    if (indiceEdicao === index) {

        indiceEdicao = null;

        fotosSelecionadas = [];

        fotoPrincipalIndex = 0;

        if (form) {
            form.reset();
        }

        atualizarPreviewFotos();

        alterarTextoBotao(
            "Cadastrar imóvel"
        );

    }


    renderizarImoveis();

}


// ======================================================
// PESQUISA
// ======================================================

if (pesquisa) {

    pesquisa.addEventListener(
        "input",
        function () {

            renderizarImoveis();

        }
    );

}


// ======================================================
// FILTRO
// ======================================================

if (filtroTipo) {

    filtroTipo.addEventListener(
        "change",
        function () {

            renderizarImoveis();

        }
    );

}


// ======================================================
// FORMATAR PREÇO
// ======================================================

function formatarPreco(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "";

    }


    let texto =
        String(valor).trim();


    // Se já estiver em formato brasileiro
    if (
        texto.includes(".") &&
        texto.includes(",")
    ) {

        texto =
            texto
                .replace(/\./g, "")
                .replace(",", ".");

    }

    else if (
        texto.includes(",")
    ) {

        texto =
            texto.replace(",", ".");

    }


    const numero =
        Number(texto);


    if (
        Number.isNaN(numero)
    ) {

        return valor;

    }


    return numero.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ======================================================
// ABRIR FOTO AMPLIADA
// ======================================================

function abrirFoto(foto) {

    if (
        !foto ||
        !modalFoto ||
        !fotoAmpliada
    ) {

        return;

    }


    fotoAmpliada.src =
        foto;


    modalFoto.style.display =
        "flex";

}


// ======================================================
// FECHAR FOTO
// ======================================================

function fecharFoto() {

    if (!modalFoto) {

        return;

    }


    modalFoto.style.display =
        "none";


    if (fotoAmpliada) {

        fotoAmpliada.src =
            "";

    }

}


// ======================================================
// CLICAR FORA DA FOTO
// ======================================================

if (modalFoto) {

    modalFoto.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                modalFoto
            ) {

                fecharFoto();

            }

        }
    );

}


// ======================================================
// TECLA ESC
// ======================================================

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            evento.key === "Escape"
        ) {

            fecharFoto();

        }

    }
);
```
