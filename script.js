const form = document.getElementById("formImovel");
const listaImoveis = document.getElementById("listaImoveis");
const pesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtroTipo");

const campoFotos = document.getElementById("fotos");
const previewFotos = document.getElementById("previewFotos");

const modalFoto = document.getElementById("modalFoto");
const fotoAmpliada = document.getElementById("fotoAmpliada");
const fecharModal = document.getElementById("fecharModal");

let fotosSelecionadas = [];
let fotoPrincipal = 0;

let imoveis = JSON.parse(localStorage.getItem("imoveis")) || [];


/* ======================================================
   SALVAR
====================================================== */

function salvarImoveis() {
    localStorage.setItem("imoveis", JSON.stringify(imoveis));
}


/* ======================================================
   FORMATAR PREÇO
====================================================== */

function formatarMoeda(valor) {

    if (!valor) {
        return "R$ 0,00";
    }

    const numero = Number(valor);

    if (isNaN(numero)) {
        return valor;
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


/* ======================================================
   ESTRELAS
====================================================== */

function gerarEstrelas(indiceImovel, avaliacao) {

    const nota = Number(avaliacao) || 0;

    let html = `
        <div class="avaliacao">
            <span class="titulo-avaliacao">Avaliação:</span>
            <div class="estrelas">
    `;

    for (let i = 1; i <= 5; i++) {

        html += `
            <button
                type="button"
                class="estrela ${i <= nota ? "selecionada" : ""}"
                data-indice="${indiceImovel}"
                data-nota="${i}"
                title="${i} estrela${i > 1 ? "s" : ""}"
            >
                ★
            </button>
        `;
    }

    html += `
            </div>
            <span class="nota-avaliacao">
                ${nota}/5
            </span>
        </div>
    `;

    return html;
}


/* ======================================================
   CARREGAR IMÓVEIS
====================================================== */

function carregarImoveis() {

    listaImoveis.innerHTML = "";

    const texto =
        pesquisa
            ? pesquisa.value.toLowerCase().trim()
            : "";

    const tipoSelecionado =
        filtroTipo
            ? filtroTipo.value
            : "";

    const encontrados = imoveis
        .map((imovel, indice) => ({
            imovel,
            indice
        }))
        .filter(item => {

            const endereco =
                String(item.imovel.endereco || "")
                    .toLowerCase();

            const tipo =
                item.imovel.tipo || "";

            const correspondeEndereco =
                endereco.includes(texto);

            const correspondeTipo =
                !tipoSelecionado ||
                tipo === tipoSelecionado;

            return (
                correspondeEndereco &&
                correspondeTipo
            );
        });


    if (encontrados.length === 0) {

        listaImoveis.innerHTML = `
            <p class="sem-imoveis">
                Nenhum imóvel encontrado.
            </p>
        `;

        return;
    }


    encontrados.forEach(item => {

        criarCardImovel(
            item.imovel,
            item.indice
        );

    });
}


/* ======================================================
   CRIAR CARD
====================================================== */

function criarCardImovel(imovel, indice) {

    const card = document.createElement("div");

    card.className = "imovel";


    /* -----------------------------------------------
       FOTOS
    ------------------------------------------------ */

    let fotos = Array.isArray(imovel.fotos)
        ? imovel.fotos
        : [];


    let fotosHTML = "";


    if (fotos.length > 0) {

        let indicePrincipal =
            Number(imovel.fotoPrincipal);

        if (
            isNaN(indicePrincipal) ||
            indicePrincipal < 0 ||
            indicePrincipal >= fotos.length
        ) {
            indicePrincipal = 0;
        }


        const fotoPrincipalAtual =
            fotos[indicePrincipal];


        /* Foto principal */

        fotosHTML += `
            <div class="foto-principal-container">

                <img
                    src="${fotoPrincipalAtual}"
                    class="foto-principal"
                    data-foto="${fotoPrincipalAtual}"
                    alt="Foto principal do imóvel"
                >

                <span class="etiqueta-principal">
                    ⭐ Foto principal
                </span>

            </div>
        `;


        /* Miniaturas */

        if (fotos.length > 1) {

            fotosHTML += `
                <div class="galeria-fotos">
            `;


            fotos.forEach((foto, fotoIndex) => {

                fotosHTML += `
                    <div
                        class="miniatura-wrapper ${
                            fotoIndex === indicePrincipal
                                ? "foto-selecionada"
                                : ""
                        }"
                    >

                        <img
                            src="${foto}"
                            class="miniatura-foto"
                            data-foto="${foto}"
                            data-indice-imovel="${indice}"
                            data-indice-foto="${fotoIndex}"
                            alt="Foto ${fotoIndex + 1}"
                        >

                    </div>
                `;

            });


            fotosHTML += `
                </div>
            `;
        }

    } else {

        fotosHTML = `
            <div class="sem-foto">
                🏠 Sem foto
            </div>
        `;
    }


    /* -----------------------------------------------
       DADOS
    ------------------------------------------------ */

    card.innerHTML = `

        ${fotosHTML}

        <div class="imovel-info">

            <h3>
                ${imovel.tipo || "Imóvel"}
            </h3>

            <p>
                <strong>📍 Endereço:</strong>
                ${imovel.endereco || "Não informado"}
            </p>

            <p class="preco">
                ${formatarMoeda(imovel.preco)}
            </p>

            ${
                imovel.quartos
                    ? `
                        <p>
                            🛏️ <strong>Quartos:</strong>
                            ${imovel.quartos}
                        </p>
                    `
                    : ""
            }

            ${
                imovel.banheiros
                    ? `
                        <p>
                            🚿 <strong>Banheiros:</strong>
                            ${imovel.banheiros}
                        </p>
                    `
                    : ""
            }

            ${
                imovel.vagas
                    ? `
                        <p>
                            🚗 <strong>Vagas:</strong>
                            ${imovel.vagas}
                        </p>
                    `
                    : ""
            }

            ${
                imovel.area
                    ? `
                        <p>
                            📐 <strong>Área:</strong>
                            ${imovel.area} m²
                        </p>
                    `
                    : ""
            }

            ${
                imovel.descricao
                    ? `
                        <p class="descricao">
                            <strong>📝 Descrição:</strong><br>
                            ${imovel.descricao}
                        </p>
                    `
                    : ""
            }

            ${gerarEstrelas(
                indice,
                imovel.avaliacao
            )}

        </div>

        <div class="imovel-acoes">

            <button
                type="button"
                class="btn-editar"
            >
                ✏️ Editar
            </button>

            <button
                type="button"
                class="btn-excluir"
            >
                🗑️ Excluir
            </button>

        </div>
    `;


    listaImoveis.appendChild(card);


    /* ==================================================
       FOTO PRINCIPAL
    ================================================== */

    const principal =
        card.querySelector(".foto-principal");

    if (principal) {

        principal.addEventListener(
            "click",
            function () {

                abrirFoto(this.src);

            }
        );
    }


    /* ==================================================
       MINIATURAS
    ================================================== */

    const miniaturas =
        card.querySelectorAll(".miniatura-foto");


    miniaturas.forEach(miniatura => {

        miniatura.addEventListener(
            "click",
            function () {

                const indiceFoto =
                    Number(
                        this.dataset.indiceFoto
                    );

                const indiceImovel =
                    Number(
                        this.dataset.indiceImovel
                    );


                imoveis[indiceImovel]
                    .fotoPrincipal =
                    indiceFoto;


                salvarImoveis();

                carregarImoveis();

            }
        );


        /* Duplo clique amplia */

        miniatura.addEventListener(
            "dblclick",
            function (event) {

                event.stopPropagation();

                abrirFoto(this.src);

            }
        );

    });


    /* ==================================================
       ESTRELAS
    ================================================== */

    const estrelas =
        card.querySelectorAll(".estrela");


    estrelas.forEach(estrela => {

        estrela.addEventListener(
            "click",
            function () {

                const indiceImovel =
                    Number(
                        this.dataset.indice
                    );

                const nota =
                    Number(
                        this.dataset.nota
                    );


                imoveis[indiceImovel]
                    .avaliacao = nota;


                salvarImoveis();

                carregarImoveis();

            }
        );

    });


    /* ==================================================
       EDITAR
    ================================================== */

    const btnEditar =
        card.querySelector(".btn-editar");


    btnEditar.addEventListener(
        "click",
        function () {

            editarImovel(indice);

        }
    );


    /* ==================================================
       EXCLUIR
    ================================================== */

    const btnExcluir =
        card.querySelector(".btn-excluir");


    btnExcluir.addEventListener(
        "click",
        function () {

            excluirImovel(indice);

        }
    );
}


/* ======================================================
   SELEÇÃO DE FOTOS
====================================================== */

if (campoFotos) {

    campoFotos.addEventListener(
        "change",
        function () {

            const arquivos =
                Array.from(this.files);


            if (arquivos.length === 0) {
                return;
            }


            arquivos.forEach(arquivo => {

                const jaExiste =
                    fotosSelecionadas.some(
                        item =>
                            item.nome === arquivo.name &&
                            item.tamanho === arquivo.size
                    );


                if (!jaExiste) {

                    fotosSelecionadas.push({
                        arquivo: arquivo,
                        nome: arquivo.name,
                        tamanho: arquivo.size
                    });

                }

            });


            /* Se não tinha foto principal,
               seleciona a primeira */

            if (
                fotosSelecionadas.length > 0 &&
                fotoPrincipal >=
                fotosSelecionadas.length
            ) {

                fotoPrincipal = 0;

            }


            atualizarPreviewFotos();


            /* Permite escolher novamente
               o mesmo arquivo */

            campoFotos.value = "";
        }
    );
}


/* ======================================================
   PREVIEW DAS FOTOS
====================================================== */

function atualizarPreviewFotos() {

    if (!previewFotos) {
        return;
    }


    previewFotos.innerHTML = "";


    if (fotosSelecionadas.length === 0) {
        return;
    }


    fotosSelecionadas.forEach(
        (item, index) => {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const container =
                        document.createElement("div");


                    container.className =
                        "preview-foto-item";


                    if (index === fotoPrincipal) {

                        container.classList.add(
                            "foto-preview-selecionada"
                        );

                    }


                    container.innerHTML = `

                        <div
                            class="preview-numero"
                        >
                            Foto ${index + 1}
                        </div>

                        <img
                            src="${event.target.result}"
                            class="preview-foto"
                            alt="Foto ${index + 1}"
                        >

                        ${
                            index === fotoPrincipal
                                ? `
                                    <div class="foto-principal-label">
                                        ⭐ Principal
                                    </div>
                                `
                                : ""
                        }

                        <button
                            type="button"
                            class="btn-remover-foto"
                            title="Remover foto"
                        >
                            ✕
                        </button>

                    `;


                    previewFotos.appendChild(
                        container
                    );


                    /* ==================================================
                       CLICAR NA FOTO
                       ESTE É O PONTO PRINCIPAL DA CORREÇÃO
                    ================================================== */

                    const imagem =
                        container.querySelector(
                            ".preview-foto"
                        );


                    imagem.addEventListener(
                        "click",
                        function () {

                            /*
                             * Ao clicar em QUALQUER foto,
                             * inclusive a terceira,
                             * ela vira a foto principal.
                             */

                            fotoPrincipal = index;

                            atualizarPreviewFotos();

                        }
                    );


                    /* ==================================================
                       BOTÃO REMOVER
                    ================================================== */

                    const remover =
                        container.querySelector(
                            ".btn-remover-foto"
                        );


                    remover.addEventListener(
                        "click",
                        function (event) {

                            event.stopPropagation();


                            fotosSelecionadas.splice(
                                index,
                                1
                            );


                            if (
                                fotoPrincipal === index
                            ) {

                                fotoPrincipal = 0;

                            } else if (
                                fotoPrincipal > index
                            ) {

                                fotoPrincipal--;

                            }


                            atualizarPreviewFotos();

                        }
                    );

                };


            reader.readAsDataURL(
                item.arquivo
            );

        }
    );
}


/* ======================================================
   CONVERTER FOTO PARA BASE64
====================================================== */

function arquivoParaBase64(arquivo) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => resolve(
                    reader.result
                );


            reader.onerror =
                erro => reject(erro);


            reader.readAsDataURL(
                arquivo
            );

        }
    );
}


/* ======================================================
   SALVAR IMÓVEL
====================================================== */

if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            try {

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


                const fotosBase64 = [];


                for (
                    const item
                    of fotosSelecionadas
                ) {

                    const base64 =
                        await arquivoParaBase64(
                            item.arquivo
                        );


                    fotosBase64.push(
                        base64
                    );

                }


                const novoImovel = {

                    tipo: tipo,

                    endereco: endereco,

                    preco: preco,

                    quartos: quartos,

                    banheiros: banheiros,

                    vagas: vagas,

                    area: area,

                    descricao: descricao,

                    fotos: fotosBase64,

                    fotoPrincipal:
                        fotoPrincipal,

                    avaliacao: 0

                };


                imoveis.push(
                    novoImovel
                );


                salvarImoveis();


                form.reset();


                fotosSelecionadas = [];

                fotoPrincipal = 0;


                atualizarPreviewFotos();

                carregarImoveis();


                alert(
                    "Imóvel cadastrado com sucesso!"
                );

            } catch (erro) {

                console.error(
                    "Erro ao salvar:",
                    erro
                );


                alert(
                    "Erro ao salvar o imóvel. " +
                    "Verifique o console."
                );

            }

        }
    );
}


/* ======================================================
   EDITAR
====================================================== */

function editarImovel(indice) {

    const imovel =
        imoveis[indice];


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
     * Importante:
     * as fotos antigas continuam no imóvel.
     */

    fotosSelecionadas = [];


    fotoPrincipal = 0;


    atualizarPreviewFotos();


    /*
     * Aqui apenas carregamos os dados
     * para edição.
     *
     * Não apagamos o imóvel ainda.
     */

    form.dataset.editando = indice;


    const botao =
        form.querySelector(
            'button[type="submit"]'
        );


    if (botao) {

        botao.textContent =
            "Salvar alterações";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ======================================================
   EXCLUIR
====================================================== */

function excluirImovel(indice) {

    if (!imoveis[indice]) {
        return;
    }


    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este imóvel?"
        );


    if (!confirmar) {
        return;
    }


    imoveis.splice(
        indice,
        1
    );


    salvarImoveis();

    carregarImoveis();
}


/* ======================================================
   PESQUISA
====================================================== */

if (pesquisa) {

    pesquisa.addEventListener(
        "input",
        carregarImoveis
    );

}


/* ======================================================
   FILTRO
====================================================== */

if (filtroTipo) {

    filtroTipo.addEventListener(
        "change",
        carregarImoveis
    );

}


/* ======================================================
   MODAL
====================================================== */

function abrirFoto(src) {

    if (!modalFoto || !fotoAmpliada) {
        return;
    }


    fotoAmpliada.src = src;

    modalFoto.style.display =
        "flex";
}


/* ======================================================
   FECHAR MODAL
====================================================== */

function fecharFotoModal() {

    if (!modalFoto) {
        return;
    }


    modalFoto.style.display =
        "none";


    if (fotoAmpliada) {
        fotoAmpliada.src = "";
    }
}


if (fecharModal) {

    fecharModal.addEventListener(
        "click",
        fecharFotoModal
    );

}


if (modalFoto) {

    modalFoto.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modalFoto
            ) {

                fecharFotoModal();

            }

        }
    );

}


/* ======================================================
   ESC FECHA FOTO
====================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            fecharFotoModal();

        }

    }
);


/* ======================================================
   INICIALIZAÇÃO
====================================================== */

carregarImoveis();
