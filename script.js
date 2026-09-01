"use strict";

/* =====================================================
IMÓVEIS FÁCIL
SISTEMA COMPLETO
===================================================== */

/* =====================================================
ELEMENTOS
===================================================== */

const form = document.getElementById("formImovel");
const listaImoveis = document.getElementById("listaImoveis");
const pesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtroTipo");

const campoFotos = document.getElementById("fotos");
const previewFotos = document.getElementById("previewFotos");

const modalFoto = document.getElementById("modalFoto");
const fotoAmpliada = document.getElementById("fotoAmpliada");
const fecharModal = document.getElementById("fecharModal");

const botaoSalvar = document.getElementById("botaoSalvar");
const botaoCancelar = document.getElementById("botaoCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
const contadorImoveis = document.getElementById("contadorImoveis");

/* =====================================================
VARIÁVEIS
===================================================== */

let imoveis = [];

let fotosSelecionadas = [];

let fotoPrincipalIndex = 0;

let indiceEdicao = null;

/* =====================================================
INICIAR
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

```
carregarImoveis();

renderizarImoveis();

atualizarPreviewFotos();
```

});

/* =====================================================
CARREGAR LOCALSTORAGE
===================================================== */

function carregarImoveis() {

```
try {

    const dados = localStorage.getItem("imoveis");

    console.log("Dados encontrados no localStorage:", dados);

    if (!dados) {

        imoveis = [];

        console.log("Nenhum imóvel salvo.");

        return;
    }

    const dadosConvertidos = JSON.parse(dados);

    if (Array.isArray(dadosConvertidos)) {

        imoveis = dadosConvertidos;

    } else {

        imoveis = [];

    }

    console.log("Total de imóveis:", imoveis.length);

} catch (erro) {

    console.error(
        "Erro ao carregar imóveis:",
        erro
    );

    imoveis = [];

}
```

}

/* =====================================================
SALVAR
===================================================== */

function salvarImoveis() {

```
try {

    localStorage.setItem(
        "imoveis",
        JSON.stringify(imoveis)
    );

    console.log(
        "Imóveis salvos:",
        imoveis.length
    );

} catch (erro) {

    console.error(
        "Erro ao salvar imóveis:",
        erro
    );

    alert(
        "Não foi possível salvar os imóveis. " +
        "O armazenamento do navegador pode estar cheio."
    );

}
```

}

/* =====================================================
SELEÇÃO DE FOTOS
===================================================== */

if (campoFotos) {

```
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
                            "Erro ao ler:",
                            arquivo.name
                        );

                    };


                leitor.readAsDataURL(
                    arquivo
                );

            }
        );


        /*
         * Limpa o campo para permitir
         * selecionar novamente a mesma foto.
         */

        this.value = "";

    }
);
```

}

/* =====================================================
PREVIEW DAS FOTOS
===================================================== */

function atualizarPreviewFotos() {

```
if (!previewFotos) {

    return;

}


previewFotos.innerHTML = "";


if (
    fotosSelecionadas.length === 0
) {

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


        /*
         * BOTÃO PRINCIPAL
         */

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


        botaoPrincipal.addEventListener(
            "click",
            function (evento) {

                evento.preventDefault();

                evento.stopPropagation();

                definirFotoPrincipal(index);

            }
        );


        /*
         * BOTÃO EXCLUIR
         */

        const botaoExcluir =
            document.createElement("button");

        botaoExcluir.type =
            "button";

        botaoExcluir.className =
            "btn-excluir-foto";

        botaoExcluir.textContent =
            "🗑️ Excluir";


        botaoExcluir.addEventListener(
            "click",
            function (evento) {

                evento.preventDefault();

                evento.stopPropagation();

                excluirFoto(index);

            }
        );


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

    }
);
```

}

/* =====================================================
DEFINIR FOTO PRINCIPAL
===================================================== */

function definirFotoPrincipal(index) {

```
if (
    index < 0 ||
    index >= fotosSelecionadas.length
) {

    return;

}


fotoPrincipalIndex = index;

atualizarPreviewFotos();
```

}

/* =====================================================
EXCLUIR FOTO
===================================================== */

function excluirFoto(index) {

```
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
```

}

/* =====================================================
FORMULÁRIO
===================================================== */

if (form) {

```
form.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        const tipo =
            document.getElementById("tipo").value;

        const endereco =
            document.getElementById("endereco").value;

        const preco =
            document.getElementById("preco").value;

        const quartos =
            document.getElementById("quartos").value;

        const banheiros =
            document.getElementById("banheiros").value;

        const vagas =
            document.getElementById("vagas").value;

        const area =
            document.getElementById("area").value;

        const descricao =
            document.getElementById("descricao").value;


        /*
         * Garante que o índice da foto
         * principal sempre seja válido.
         */

        if (
            fotosSelecionadas.length === 0
        ) {

            fotoPrincipalIndex = 0;

        }

        else if (
            fotoPrincipalIndex < 0 ||
            fotoPrincipalIndex >=
            fotosSelecionadas.length
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


        /*
         * EDITAR
         */

        if (
            indiceEdicao !== null
        ) {

            imoveis[indiceEdicao] =
                imovel;

        }

        /*
         * NOVO
         */

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
```

}

/* =====================================================
LIMPAR FORMULÁRIO
===================================================== */

function limparFormulario() {

```
if (form) {

    form.reset();

}


fotosSelecionadas = [];

fotoPrincipalIndex = 0;

indiceEdicao = null;


atualizarPreviewFotos();


if (botaoSalvar) {

    botaoSalvar.textContent =
        "Cadastrar imóvel";

}


if (botaoCancelar) {

    botaoCancelar.style.display =
        "none";

}


if (tituloFormulario) {

    tituloFormulario.textContent =
        "Cadastrar imóvel";

}
```

}

/* =====================================================
EDITAR IMÓVEL
===================================================== */

function editarImovel(index) {

```
const imovel =
    imoveis[index];


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


/*
 * Recuperar fotos.
 */

fotosSelecionadas =
    Array.isArray(imovel.fotos)
        ? [...imovel.fotos]
        : [];


/*
 * Recuperar foto principal.
 */

fotoPrincipalIndex =
    Number(imovel.fotoPrincipal);


if (
    !Number.isInteger(fotoPrincipalIndex) ||
    fotoPrincipalIndex < 0 ||
    fotoPrincipalIndex >=
    fotosSelecionadas.length
) {

    fotoPrincipalIndex = 0;

}


indiceEdicao = index;


atualizarPreviewFotos();


if (botaoSalvar) {

    botaoSalvar.textContent =
        "Salvar alterações";

}


if (botaoCancelar) {

    botaoCancelar.style.display =
        "block";

}


if (tituloFormulario) {

    tituloFormulario.textContent =
        "Editar imóvel";

}


form.scrollIntoView({

    behavior: "smooth",

    block: "start"

});
```

}

/* =====================================================
CANCELAR EDIÇÃO
===================================================== */

if (botaoCancelar) {

```
botaoCancelar.addEventListener(
    "click",
    function () {

        limparFormulario();

    }
);
```

}

/* =====================================================
EXCLUIR IMÓVEL
===================================================== */

function excluirImovel(index) {

```
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
        'Deseja realmente excluir o imóvel "' +
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

else if (
    indiceEdicao !== null &&
    index < indiceEdicao
) {

    indiceEdicao--;

}


renderizarImoveis();
```

}

/* =====================================================
RENDERIZAR IMÓVEIS
===================================================== */

function renderizarImoveis() {

```
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


console.log(
    "Imóveis encontrados:",
    encontrados.length
);


/*
 * CONTADOR
 */

if (contadorImoveis) {

    contadorImoveis.textContent =
        encontrados.length +
        (
            encontrados.length === 1
                ? " imóvel encontrado"
                : " imóveis encontrados"
        );

}


/*
 * NENHUM
 */

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


/*
 * CARDS
 */

encontrados.forEach(
    function (imovel) {

        const indiceReal =
            imoveis.indexOf(imovel);


        criarCardImovel(
            imovel,
            indiceReal
        );

    }
);
```

}

/* =====================================================
CRIAR CARD
===================================================== */

function criarCardImovel(
imovel,
indice
) {

```
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


/*
 * FOTO
 */

let htmlFoto = "";


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


/*
 * DETALHES
 */

let htmlDetalhes = "";


if (imovel.quartos) {

    htmlDetalhes +=
        "<span>🛏️ " +
        imovel.quartos +
        " quartos</span>";

}


if (imovel.banheiros) {

    htmlDetalhes +=
        "<span>🚿 " +
        imovel.banheiros +
        " banheiros</span>";

}


if (imovel.vagas) {

    htmlDetalhes +=
        "<span>🚗 " +
        imovel.vagas +
        " vagas</span>";

}


if (imovel.area) {

    htmlDetalhes +=
        "<span>📐 " +
        imovel.area +
        " m²</span>";

}


/*
 * MINIATURAS
 */

let htmlMiniaturas = "";


if (fotos.length > 1) {

    htmlMiniaturas =
        '<div class="miniaturas">';


    fotos.forEach(
        function (foto, fotoIndex) {

            const classePrincipal =
                fotoIndex === principal
                    ? "miniatura-principal"
                    : "";


            htmlMiniaturas +=
                '<div class="miniatura ' +
                classePrincipal +
                '" data-foto-index="' +
                fotoIndex +
                '">' +

                '<img src="' +
                foto +
                '" alt="Foto ' +
                (fotoIndex + 1) +
                '">' +

                (
                    fotoIndex === principal
                        ? "<span>⭐</span>"
                        : ""
                ) +

                "</div>";

        }
    );


    htmlMiniaturas +=
        "</div>";

}


/*
 * CARD
 */

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


/*
 * FOTO PRINCIPAL
 */

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


/*
 * MINIATURAS
 */

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


/*
 * EDITAR
 */

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


/*
 * EXCLUIR
 */

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
```

}

/* =====================================================
PESQUISA
===================================================== */

if (pesquisa) {

```
pesquisa.addEventListener(
    "input",
    function () {

        renderizarImoveis();

    }
);
```

}

/* =====================================================
FILTRO
===================================================== */

if (filtroTipo) {

```
filtroTipo.addEventListener(
    "change",
    function () {

        renderizarImoveis();

    }
);
```

}

/* =====================================================
FORMATAR PREÇO
===================================================== */

function formatarPreco(valor) {

```
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
```

}

/* =====================================================
ABRIR FOTO
===================================================== */

function abrirFoto(foto) {

```
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
```

}

/* =====================================================
FECHAR FOTO
===================================================== */

function fecharFotoAmpliada() {

```
if (!modalFoto) {

    return;

}


modalFoto.style.display =
    "none";


if (fotoAmpliada) {

    fotoAmpliada.src = "";

}
```

}

/* =====================================================
BOTÃO FECHAR
===================================================== */

if (fecharModal) {

```
fecharModal.addEventListener(
    "click",
    function () {

        fecharFotoAmpliada();

    }
);
```

}

/* =====================================================
CLICAR FORA
===================================================== */

if (modalFoto) {

```
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
```

}

/* =====================================================
ESC
===================================================== */

document.addEventListener(
"keydown",
function (evento) {

```
    if (
        evento.key === "Escape"
    ) {

        fecharFotoAmpliada();

    }

}
```

);
