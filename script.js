javascript
// ======================================================
// IMÓVEIS FÁCIL
// SCRIPT COMPLETO
// ======================================================


// ======================================================
// ELEMENTOS
// ======================================================

const form = document.getElementById("formImovel");

const listaImoveis =
    document.getElementById("listaImoveis");

const pesquisa =
    document.getElementById("pesquisa");

const filtroTipo =
    document.getElementById("filtroTipo");

const campoFotos =
    document.getElementById("fotos");

const previewFotos =
    document.getElementById("previewFotos");

const modalFoto =
    document.getElementById("modalFoto");

const fotoAmpliada =
    document.getElementById("fotoAmpliada");

const fecharModal =
    document.getElementById("fecharModal");

const btnSalvar =
    document.getElementById("btnSalvar");

const btnCancelarEdicao =
    document.getElementById("btnCancelarEdicao");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const contadorImoveis =
    document.getElementById("contadorImoveis");


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

        const dados =
            localStorage.getItem("imoveis");


        if (!dados) {

            imoveis = [];

            return;

        }


        const dadosConvertidos =
            JSON.parse(dados);


        if (
            Array.isArray(
                dadosConvertidos
            )
        ) {

            imoveis =
                dadosConvertidos;

        } else {

            imoveis = [];

        }


        // Garante compatibilidade
        // com imóveis antigos.
        imoveis.forEach(
            function (imovel) {

                if (
                    !Array.isArray(
                        imovel.fotos
                    )
                ) {

                    imovel.fotos = [];

                }


                let principal =
                    Number(
                        imovel.fotoPrincipal
                    );


                if (
                    !Number.isInteger(
                        principal
                    ) ||
                    principal < 0 ||
                    principal >=
                        imovel.fotos.length
                ) {

                    imovel.fotoPrincipal = 0;

                }

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar imóveis:",
            erro
        );

        imoveis = [];

    }

}


// ======================================================
// SALVAR
// ======================================================

function salvarImoveis() {

    try {

        localStorage.setItem(
            "imoveis",
            JSON.stringify(imoveis)
        );


        return true;


    } catch (erro) {

        console.error(
            "Erro ao salvar imóveis:",
            erro
        );


        alert(
            "Não foi possível salvar. " +
            "O armazenamento do navegador pode estar cheio."
        );


        return false;

    }

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

carregarImoveis();

renderizarImoveis();

atualizarPreviewFotos();


// ======================================================
// SELECIONAR FOTOS
// ======================================================

if (campoFotos) {

    campoFotos.addEventListener(
        "change",
        function () {

            const arquivos =
                Array.from(
                    this.files
                );


            if (
                arquivos.length === 0
            ) {

                return;

            }


            arquivos.forEach(
                function (arquivo) {

                    if (
                        !arquivo.type.startsWith(
                            "image/"
                        )
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


                            // Primeira foto
                            // é principal.
                            if (
                                fotosSelecionadas.length === 1
                            ) {

                                fotoPrincipalIndex =
                                    0;

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


            // Permite selecionar
            // novamente a mesma foto.
            this.value = "";

        }
    );

}


// ======================================================
// MOSTRAR FOTOS
// ======================================================

function atualizarPreviewFotos() {

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
                document.createElement(
                    "div"
                );


            container.className =
                "foto-preview-item";


            if (
                index ===
                fotoPrincipalIndex
            ) {

                container.classList.add(
                    "foto-principal"
                );

            }


            // ==========================================
            // FOTO
            // ==========================================

            const imagem =
                document.createElement(
                    "img"
                );


            imagem.src =
                foto;


            imagem.alt =
                "Foto " +
                (index + 1);


            imagem.addEventListener(
                "click",
                function () {

                    abrirFoto(
                        foto
                    );

                }
            );


            // ==========================================
            // AÇÕES
            // ==========================================

            const acoes =
                document.createElement(
                    "div"
                );


            acoes.className =
                "acoes-foto";


            // ==========================================
            // PRINCIPAL
            // ==========================================

            const botaoPrincipal =
                document.createElement(
                    "button"
                );


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

                    definirFotoPrincipal(
                        index
                    );

                }
            );


            // ==========================================
            // EXCLUIR
            // ==========================================

            const botaoExcluir =
                document.createElement(
                    "button"
                );


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

                    excluirFoto(
                        index
                    );

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


    fotoPrincipalIndex =
        index;


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
        index ===
        fotoPrincipalIndex;


    fotosSelecionadas.splice(
        index,
        1
    );


    // ==========================================
    // NÃO HÁ MAIS FOTOS
    // ==========================================

    if (
        fotosSelecionadas.length === 0
    ) {

        fotoPrincipalIndex = 0;

    }


    // ==========================================
    // EXCLUIU A PRINCIPAL
    // ==========================================

    else if (eraPrincipal) {

        if (
            index <
            fotosSelecionadas.length
        ) {

            fotoPrincipalIndex =
                index;

        } else {

            fotoPrincipalIndex =
                fotosSelecionadas.length -
                1;

        }

    }


    // ==========================================
    // EXCLUIU FOTO ANTES DA PRINCIPAL
    // ==========================================

    else if (
        index <
        fotoPrincipalIndex
    ) {

        fotoPrincipalIndex--;

    }


    atualizarPreviewFotos();

}


// ======================================================
// CADASTRAR / SALVAR EDIÇÃO
// ======================================================

if (form) {

    form.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            // ==========================================
            // CAMPOS
            // ==========================================

            const tipo =
                document.getElementById(
                    "tipo"
                ).value;


            const endereco =
                document.getElementById(
                    "endereco"
                ).value;


            const preco =
                document.getElementById(
                    "preco"
                ).value;


            const quartos =
                document.getElementById(
                    "quartos"
                ).value;


            const banheiros =
                document.getElementById(
                    "banheiros"
                ).value;


            const vagas =
                document.getElementById(
                    "vagas"
                ).value;


            const area =
                document.getElementById(
                    "area"
                ).value;


            const descricao =
                document.getElementById(
                    "descricao"
                ).value;


            // ==========================================
            // FOTO PRINCIPAL
            // ==========================================

            if (
                fotosSelecionadas.length === 0
            ) {

                fotoPrincipalIndex = 0;

            }


            if (
                fotoPrincipalIndex < 0 ||
                fotoPrincipalIndex >=
                    fotosSelecionadas.length
            ) {

                fotoPrincipalIndex = 0;

            }


            // ==========================================
            // OBJETO
            // ==========================================

            const imovel = {

                tipo:
                    tipo,

                endereco:
                    endereco,

                preco:
                    preco,

                quartos:
                    quartos,

                banheiros:
                    banheiros,

                vagas:
                    vagas,

                area:
                    area,

                descricao:
                    descricao,

                fotos:
                    [...fotosSelecionadas],

                fotoPrincipal:
                    fotoPrincipalIndex

            };


            // ==========================================
            // EDITAR
            // ==========================================

            if (
                indiceEdicao !== null
            ) {

                imoveis[
                    indiceEdicao
                ] =
                    imovel;

            }


            // ==========================================
            // NOVO
            // ==========================================

            else {

                imoveis.push(
                    imovel
                );

            }


            // ==========================================
            // SALVAR
            // ==========================================

            if (
                !salvarImoveis()
            ) {

                return;

            }


            // ==========================================
            // LIMPAR
            // ==========================================

            limparFormulario();


            renderizarImoveis();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// ======================================================
// LIMPAR FORMULÁRIO
// ======================================================

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


    if (btnCancelarEdicao) {

        btnCancelarEdicao.style.display =
            "none";

    }


    if (tituloFormulario) {

        tituloFormulario.textContent =
            "Cadastrar imóvel";

    }

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


    document.getElementById(
        "tipo"
    ).value =
        imovel.tipo || "";


    document.getElementById(
        "endereco"
    ).value =
        imovel.endereco || "";


    document.getElementById(
        "preco"
    ).value =
        imovel.preco || "";


    document.getElementById(
        "quartos"
    ).value =
        imovel.quartos || "";


    document.getElementById(
        "banheiros"
    ).value =
        imovel.banheiros || "";


    document.getElementById(
        "vagas"
    ).value =
        imovel.vagas || "";


    document.getElementById(
        "area"
    ).value =
        imovel.area || "";


    document.getElementById(
        "descricao"
    ).value =
        imovel.descricao || "";


    // ==========================================
    // FOTOS EXISTENTES
    // ==========================================

    fotosSelecionadas =
        Array.isArray(
            imovel.fotos
        )
            ? [...imovel.fotos]
            : [];


    // ==========================================
    // PRINCIPAL
    // ==========================================

    fotoPrincipalIndex =
        Number(
            imovel.fotoPrincipal
        );


    if (
        !Number.isInteger(
            fotoPrincipalIndex
        ) ||
        fotoPrincipalIndex < 0 ||
        fotoPrincipalIndex >=
            fotosSelecionadas.length
    ) {

        fotoPrincipalIndex = 0;

    }


    indiceEdicao =
        index;


    atualizarPreviewFotos();


    if (btnSalvar) {

        btnSalvar.textContent =
            "Salvar alterações";

    }


    if (btnCancelarEdicao) {

        btnCancelarEdicao.style.display =
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

}


// ======================================================
// CANCELAR EDIÇÃO
// ======================================================

if (btnCancelarEdicao) {

    btnCancelarEdicao.addEventListener(
        "click",
        function () {

            limparFormulario();

        }
    );

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
            "Deseja realmente excluir " +
            endereco +
            "?"
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
                        imovel.endereco ||
                        ""
                    ).toLowerCase();


                const tipo =
                    String(
                        imovel.tipo ||
                        ""
                    );


                return (
                    endereco.includes(
                        termo
                    ) &&
                    (
                        tipoSelecionado === "" ||
                        tipo === tipoSelecionado
                    )
                );

            }
        );


    // ==========================================
    // CONTADOR
    // ==========================================

    if (contadorImoveis) {

        contadorImoveis.textContent =
            encontrados.length +
            (
                encontrados.length === 1
                    ? " imóvel encontrado"
                    : " imóveis encontrados"
            );

    }


    // ==========================================
    // NENHUM
    // ==========================================

    if (
        encontrados.length === 0
    ) {

        listaImoveis.innerHTML = `

            <div class="nenhum-imovel">

                <p>
                    Nenhum imóvel encontrado.
                </p>

            </div>

        `;

        return;

    }


    // ==========================================
    // CARDS
    // ==========================================

    encontrados.forEach(
        function (imovel) {

            const indice =
                imoveis.indexOf(
                    imovel
                );


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
        document.createElement(
            "div"
        );


    card.className =
        "card-imovel";


    // ==========================================
    // FOTOS
    // ==========================================

    const fotos =
        Array.isArray(
            imovel.fotos
        )
            ? imovel.fotos
            : [];


    let principal =
        Number(
            imovel.fotoPrincipal
        );


    if (
        !Number.isInteger(
            principal
        ) ||
        principal < 0 ||
        principal >= fotos.length
    ) {

        principal = 0;

    }


    const fotoPrincipal =
        fotos.length > 0
            ? fotos[principal]
            : "";


    // ==========================================
    // FOTO PRINCIPAL
    // ==========================================

    let htmlFoto = "";


    if (fotoPrincipal) {

        htmlFoto = `

            <img
                class="imagem-principal-card"
                src="${fotoPrincipal}"
                alt="Foto principal"
            >

        `;

    } else {

        htmlFoto = `

            <div class="sem-imagem">

                🏠

                <span>
                    Sem foto
                </span>

            </div>

        `;

    }


    // ==========================================
    // DETALHES
    // ==========================================

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


    // ==========================================
    // MINIATURAS
    // ==========================================

    let miniaturasHTML = "";


    if (
        fotos.length > 1
    ) {

        miniaturasHTML =
            `<div class="miniaturas">`;


        fotos.forEach(
            function (
                foto,
                fotoIndex
            ) {

                const classe =
                    fotoIndex === principal
                        ? "miniatura-principal"
                        : "";


                miniaturasHTML += `

                    <div
                        class="miniatura ${classe}"
                        data-foto-index="${fotoIndex}"
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


        miniaturasHTML +=
            `</div>`;

    }


    // ==========================================
    // CARD
    // ==========================================

    card.innerHTML = `

        <div class="imagem-imovel">

            ${htmlFoto}

        </div>


        <div class="info-imovel">

            <h3>
                ${imovel.tipo || "Imóvel"}
            </h3>


            <p class="endereco">
                📍
                ${imovel.endereco || "Endereço não informado"}
            </p>


            ${
                imovel.preco
                    ? `
                        <p class="preco">
                            💰 R$
                            ${formatarPreco(imovel.preco)}
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


            ${miniaturasHTML}


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


    // ==========================================
    // FOTO PRINCIPAL
    // ==========================================

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


    // ==========================================
    // MINIATURAS
    // ==========================================

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


    // ==========================================
    // EDITAR
    // ==========================================

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


    // ==========================================
    // EXCLUIR
    // ==========================================

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


    const numero =
        Number(
            String(valor)
                .replace(",", ".")
        );


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
// ABRIR FOTO
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
// BOTÃO FECHAR
// ======================================================

if (fecharModal) {

    fecharModal.addEventListener(
        "click",
        function () {

            fecharFoto();

        }
    );

}


// ======================================================
// CLICAR FORA
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
// ESC
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
