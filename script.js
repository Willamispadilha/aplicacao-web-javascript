// =====================================================
// IMÓVEIS FÁCIL
// SCRIPT COMPLETO
// =====================================================

"use strict";


// =====================================================
// ELEMENTOS
// =====================================================

const form = document.getElementById("formImovel");
const listaImoveis = document.getElementById("listaImoveis");
const pesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtroTipo");

const campoFotos = document.getElementById("fotos");
const previewFotos = document.getElementById("previewFotos");

const modalFoto = document.getElementById("modalFoto");
const fotoAmpliada = document.getElementById("fotoAmpliada");
const fecharModal = document.getElementById("fecharModal");

const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");


// =====================================================
// VARIÁVEIS
// =====================================================

let imoveis = [];

let fotosSelecionadas = [];

let fotoPrincipalIndex = 0;

let indiceEdicao = null;


// =====================================================
// INICIAR SISTEMA
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    carregarImoveis();

    renderizarImoveis();

    atualizarPreviewFotos();

});


// =====================================================
// CARREGAR IMÓVEIS
// =====================================================

function carregarImoveis() {

    try {

        const dados = localStorage.getItem("imoveis");

        console.log("Dados encontrados no localStorage:", dados);

        if (!dados) {

            imoveis = [];

            return;
        }


        const convertido = JSON.parse(dados);


        if (Array.isArray(convertido)) {

            imoveis = convertido;

        } else {

            imoveis = [];

        }


        // Corrige dados antigos
        imoveis = imoveis.map(function (imovel) {

            if (!imovel || typeof imovel !== "object") {

                return {
                    tipo: "",
                    endereco: "",
                    preco: "",
                    quartos: "",
                    banheiros: "",
                    vagas: "",
                    area: "",
                    descricao: "",
                    fotos: [],
                    fotoPrincipal: 0
                };

            }


            let fotos = [];

            if (Array.isArray(imovel.fotos)) {

                fotos = imovel.fotos.filter(function (foto) {

                    return typeof foto === "string" &&
                           foto.length > 0;

                });

            }


            let principal = Number(imovel.fotoPrincipal);


            if (
                !Number.isInteger(principal) ||
                principal < 0 ||
                principal >= fotos.length
            ) {

                principal = 0;

            }


            return {

                tipo: imovel.tipo || "",

                endereco: imovel.endereco || "",

                preco: imovel.preco || "",

                quartos: imovel.quartos || "",

                banheiros: imovel.banheiros || "",

                vagas: imovel.vagas || "",

                area: imovel.area || "",

                descricao: imovel.descricao || "",

                fotos: fotos,

                fotoPrincipal: principal

            };

        });


        console.log(
            "Imóveis carregados:",
            imoveis
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar imóveis:",
            erro
        );

        imoveis = [];

    }

}


// =====================================================
// SALVAR
// =====================================================

function salvarImoveis() {

    try {

        localStorage.setItem(
            "imoveis",
            JSON.stringify(imoveis)
        );

        console.log(
            "Imóveis salvos:",
            imoveis
        );

    }

    catch (erro) {

        console.error(
            "Erro ao salvar:",
            erro
        );

        alert(
            "Não foi possível salvar os imóveis. " +
            "O armazenamento do navegador pode estar cheio."
        );

    }

}


// =====================================================
// FOTOS - SELECIONAR
// =====================================================

if (campoFotos) {

    campoFotos.addEventListener(
        "change",
        function () {

            const arquivos =
                Array.from(this.files);


            if (arquivos.length === 0) {

                return;

            }


            arquivos.forEach(
                function (arquivo) {

                    if (
                        !arquivo.type.startsWith("image/")
                    ) {

                        alert(
                            "O arquivo " +
                            arquivo.name +
                            " não é uma imagem."
                        );

                        return;

                    }


                    const leitor =
                        new FileReader();


                    leitor.onload =
                        function (evento) {

                            fotosSelecionadas.push(
                                evento.target.result
                            );


                            if (
                                fotosSelecionadas.length === 1
                            ) {

                                fotoPrincipalIndex = 0;

                            }


                            atualizarPreviewFotos();

                        };


                    leitor.onerror =
                        function () {

                            console.error(
                                "Erro ao carregar:",
                                arquivo.name
                            );

                        };


                    leitor.readAsDataURL(
                        arquivo
                    );

                }
            );


            // Permite selecionar a mesma foto novamente
            this.value = "";

        }
    );

}


// =====================================================
// ATUALIZAR PREVIEW
// =====================================================

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


    fotosSelecionadas.forEach(
        function (foto, index) {

            const container =
                document.createElement("div");


            container.className =
                "foto-preview-item";


            if (
                index === fotoPrincipalIndex
            ) {

                container.classList.add(
                    "foto-principal"
                );

            }


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


            const acoes =
                document.createElement("div");


            acoes.className =
                "acoes-foto";


            // ================================
            // PRINCIPAL
            // ================================

            const principal =
                document.createElement("button");


            principal.type =
                "button";


            principal.className =
                "btn-principal";


            principal.textContent =
                index === fotoPrincipalIndex
                    ? "⭐ Principal"
                    : "☆ Principal";


            principal.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();

                    evento.stopPropagation();

                    definirFotoPrincipal(index);

                }
            );


            // ================================
            // EXCLUIR
            // ================================

            const excluir =
                document.createElement("button");


            excluir.type =
                "button";


            excluir.className =
                "btn-excluir-foto";


            excluir.textContent =
                "🗑️ Excluir";


            excluir.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();

                    evento.stopPropagation();

                    excluirFoto(index);

                }
            );


            acoes.appendChild(
                principal
            );

            acoes.appendChild(
                excluir
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

        }
    );

}


// =====================================================
// DEFINIR FOTO PRINCIPAL
// =====================================================

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


// =====================================================
// EXCLUIR FOTO
// =====================================================

function excluirFoto(index) {

    if (
        index < 0 ||
        index >= fotosSelecionadas.length
    ) {

        return;

    }


    const eraPrincipal =
        index === fotoPrincipalIndex;


    fotosSelecionadas.splice(
        index,
        1
    );


    if (
        fotosSelecionadas.length === 0
    ) {

        fotoPrincipalIndex = 0;

    }

    else if (eraPrincipal) {

        if (
            index < fotosSelecionadas.length
        ) {

            fotoPrincipalIndex = index;

        }

        else {

            fotoPrincipalIndex =
                fotosSelecionadas.length - 1;

        }

    }

    else if (
        index < fotoPrincipalIndex
    ) {

        fotoPrincipalIndex--;

    }


    atualizarPreviewFotos();

}


// =====================================================
// FORMULÁRIO
// =====================================================

if (form) {

    form.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const tipo =
                document.getElementById("tipo").value.trim();


            const endereco =
                document
                    .getElementById("endereco")
                    .value
                    .trim();


            const preco =
                document
                    .getElementById("preco")
                    .value;


            const quartos =
                document
                    .getElementById("quartos")
                    .value;


            const banheiros =
                document
                    .getElementById("banheiros")
                    .value;


            const vagas =
                document
                    .getElementById("vagas")
                    .value;


            const area =
                document
                    .getElementById("area")
                    .value;


            const descricao =
                document
                    .getElementById("descricao")
                    .value
                    .trim();


            // Corrigir principal
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


            // =================================================
            // EDITAR
            // =================================================

            if (
                indiceEdicao !== null
            ) {

                imoveis[indiceEdicao] =
                    imovel;

            }

            // =================================================
            // NOVO
            // =================================================

            else {

                imoveis.push(
                    imovel
                );

            }


            salvarImoveis();


            limparFormulario();


            renderizarImoveis();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// =====================================================
// LIMPAR FORMULÁRIO
// =====================================================

function limparFormulario() {

    if (form) {

        form.reset();

    }


    fotosSelecionadas = [];

    fotoPrincipalIndex = 0;

    indiceEdicao = null;


    atualizarPreviewFotos();


    if (btnSalvar) {

        btnSalvar.textContent =
            "Cadastrar imóvel";

    }


    if (btnCancelar) {

        btnCancelar.style.display =
            "none";

    }

}


// =====================================================
// EDITAR IMÓVEL
// =====================================================

function editarImovel(index) {

    if (
        index < 0 ||
        index >= imoveis.length
    ) {

        return;

    }


    const imovel =
        imoveis[index];


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


    fotosSelecionadas =
        Array.isArray(imovel.fotos)
            ? [...imovel.fotos]
            : [];


    fotoPrincipalIndex =
        Number(imovel.fotoPrincipal);


    if (
        !Number.isInteger(fotoPrincipalIndex) ||
        fotoPrincipalIndex < 0 ||
        fotoPrincipalIndex >= fotosSelecionadas.length
    ) {

        fotoPrincipalIndex = 0;

    }


    indiceEdicao = index;


    atualizarPreviewFotos();


    if (btnSalvar) {

        btnSalvar.textContent =
            "Salvar alterações";

    }


    if (btnCancelar) {

        btnCancelar.style.display =
            "block";

    }


    if (form) {

        form.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}


// =====================================================
// CANCELAR EDIÇÃO
// =====================================================

if (btnCancelar) {

    btnCancelar.addEventListener(
        "click",
        function () {

            limparFormulario();

        }
    );

}


// =====================================================
// EXCLUIR IMÓVEL
// =====================================================

function excluirImovel(index) {

    if (
        index < 0 ||
        index >= imoveis.length
    ) {

        return;

    }


    const imovel =
        imoveis[index];


    const endereco =
        imovel.endereco ||
        "este imóvel";


    const confirmar =
        confirm(
            'Deseja realmente excluir "' +
            endereco +
            '"?'
        );


    if (!confirmar) {

        return;

    }


    imoveis.splice(
        index,
        1
    );


    salvarImoveis();


    if (
        indiceEdicao === index
    ) {

        limparFormulario();

    }


    renderizarImoveis();

}


// =====================================================
// RENDERIZAR IMÓVEIS
// =====================================================

function renderizarImoveis() {

    if (!listaImoveis) {

        console.error(
            "Elemento #listaImoveis não encontrado."
        );

        return;

    }


    listaImoveis.innerHTML = "";


    const termo =
        pesquisa
            ? pesquisa.value
                .toLowerCase()
                .trim()
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


                const pesquisaOK =
                    endereco.includes(
                        termo
                    );


                const tipoOK =
                    tipoSelecionado === "" ||
                    tipo === tipoSelecionado;


                return (
                    pesquisaOK &&
                    tipoOK
                );

            }
        );


    console.log(
        "Total de imóveis:",
        imoveis.length
    );


    console.log(
        "Imóveis encontrados:",
        encontrados.length
    );


    if (
        encontrados.length === 0
    ) {

        listaImoveis.innerHTML = `
            <div class="nenhum-imovel">
                <p>Nenhum imóvel encontrado.</p>
            </div>
        `;

        return;

    }


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


// =====================================================
// CRIAR CARD
// =====================================================

function criarCardImovel(
    imovel,
    indice
) {

    const card =
        document.createElement("div");


    card.className =
        "card-imovel";


    const fotos =
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


    // =================================================
    // FOTO
    // =================================================

    let htmlFoto = "";


    if (fotoPrincipal) {

        htmlFoto = `
            <img
                class="imagem-principal-card"
                src="${fotoPrincipal}"
                alt="Foto principal"
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


    // =================================================
    // DETALHES
    // =================================================

    let detalhes = "";


    if (imovel.quartos) {

        detalhes +=
            `<span>🛏️ ${imovel.quartos} quartos</span>`;

    }


    if (imovel.banheiros) {

        detalhes +=
            `<span>🚿 ${imovel.banheiros} banheiros</span>`;

    }


    if (imovel.vagas) {

        detalhes +=
            `<span>🚗 ${imovel.vagas} vagas</span>`;

    }


    if (imovel.area) {

        detalhes +=
            `<span>📐 ${imovel.area} m²</span>`;

    }


    // =================================================
    // MINIATURAS
    // =================================================

    let miniaturas = "";


    if (
        fotos.length > 1
    ) {

        miniaturas =
            `<div class="miniaturas">`;


        fotos.forEach(
            function (foto, fotoIndex) {

                const principalClass =
                    fotoIndex === principal
                        ? "miniatura-principal"
                        : "";


                miniaturas += `
                    <div
                        class="miniatura ${principalClass}"
                        data-foto="${fotoIndex}"
                    >

                        <img
                            src="${foto}"
                            alt="Foto ${fotoIndex + 1}"
                        >

                        ${
                            fotoIndex === principal
                                ? "<span>⭐</span>"
                                : ""
                        }

                    </div>
                `;

            }
        );


        miniaturas +=
            `</div>`;

    }


    // =================================================
    // CARD
    // =================================================

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
                detalhes
                    ? `
                        <div class="detalhes-imovel">
                            ${detalhes}
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


            ${miniaturas}


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


    // =================================================
    // FOTO PRINCIPAL
    // =================================================

    const imagem =
        card.querySelector(
            ".imagem-principal-card"
        );


    if (imagem) {

        imagem.addEventListener(
            "click",
            function () {

                abrirFoto(
                    fotoPrincipal
                );

            }
        );

    }


    // =================================================
    // MINIATURAS
    // =================================================

    const listaMiniaturas =
        card.querySelectorAll(
            ".miniatura"
        );


    listaMiniaturas.forEach(
        function (miniatura) {

            miniatura.addEventListener(
                "click",
                function () {

                    const fotoIndex =
                        Number(
                            miniatura.dataset.foto
                        );


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


    // =================================================
    // EDITAR
    // =================================================

    const editar =
        card.querySelector(
            "[data-editar]"
        );


    if (editar) {

        editar.addEventListener(
            "click",
            function () {

                editarImovel(
                    Number(
                        editar.dataset.editar
                    )
                );

            }
        );

    }


    // =================================================
    // EXCLUIR
    // =================================================

    const excluir =
        card.querySelector(
            "[data-excluir]"
        );


    if (excluir) {

        excluir.addEventListener(
            "click",
            function () {

                excluirImovel(
                    Number(
                        excluir.dataset.excluir
                    )
                );

            }
        );

    }


    listaImoveis.appendChild(
        card
    );

}


// =====================================================
// PESQUISA
// =====================================================

if (pesquisa) {

    pesquisa.addEventListener(
        "input",
        function () {

            renderizarImoveis();

        }
    );

}


// =====================================================
// FILTRO
// =====================================================

if (filtroTipo) {

    filtroTipo.addEventListener(
        "change",
        function () {

            renderizarImoveis();

        }
    );

}


// =====================================================
// FORMATAR PREÇO
// =====================================================

function formatarPreco(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "";

    }


    const numero =
        Number(valor);


    if (
        Number.isNaN(numero)
    ) {

        return String(valor);

    }


    return numero.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// =====================================================
// ABRIR FOTO
// =====================================================

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


// =====================================================
// FECHAR FOTO
// =====================================================

function fecharFotoAmpliada() {

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


// =====================================================
// BOTÃO FECHAR
// =====================================================

if (fecharModal) {

    fecharModal.addEventListener(
        "click",
        function () {

            fecharFotoAmpliada();

        }
    );

}


// =====================================================
// CLICAR FORA
// =====================================================

if (modalFoto) {

    modalFoto.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target === modalFoto
            ) {

                fecharFotoAmpliada();

            }

        }
    );

}


// =====================================================
// ESC
// =====================================================

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            evento.key === "Escape"
        ) {

            fecharFotoAmpliada();

        }

    }
);
