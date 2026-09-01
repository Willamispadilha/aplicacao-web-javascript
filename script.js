const form = document.getElementById("formImovel");
const listaImoveis = document.getElementById("listaImoveis");
const pesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtroTipo");

const campoFotos = document.getElementById("fotos");
const previewFotos = document.getElementById("previewFotos");

const modalFoto = document.getElementById("modalFoto");
const fotoAmpliada = document.getElementById("fotoAmpliada");

let fotosSelecionadas = [];
let imoveis = JSON.parse(localStorage.getItem("imoveis")) || [];

// ======================================================
// CARREGAR IMÓVEIS
// ======================================================

function salvarImoveis() {
    localStorage.setItem("imoveis", JSON.stringify(imoveis));
}

function carregarImoveis() {
    listaImoveis.innerHTML = "";

    const textoPesquisa = pesquisa
        ? pesquisa.value.toLowerCase().trim()
        : "";

    const tipoSelecionado = filtroTipo
        ? filtroTipo.value
        : "";

    const imoveisFiltrados = imoveis.filter(imovel => {

        const endereco = (imovel.endereco || "").toLowerCase();
        const tipo = imovel.tipo || "";

        const correspondePesquisa =
            endereco.includes(textoPesquisa);

        const correspondeTipo =
            !tipoSelecionado || tipo === tipoSelecionado;

        return correspondePesquisa && correspondeTipo;
    });

    if (imoveisFiltrados.length === 0) {
        listaImoveis.innerHTML = `
            <p class="sem-imoveis">
                Nenhum imóvel encontrado.
            </p>
        `;
        return;
    }

    imoveisFiltrados.forEach((imovel, indice) => {
        const indiceOriginal = imoveis.indexOf(imovel);

        criarCardImovel(imovel, indiceOriginal);
    });
}


// ======================================================
// CRIAR CARD DO IMÓVEL
// ======================================================

function criarCardImovel(imovel, indice) {

    const card = document.createElement("div");
    card.className = "card-imovel";

    let fotosHTML = "";

    if (imovel.fotos && imovel.fotos.length > 0) {

        fotosHTML = `
            <div class="galeria-imovel">
                ${imovel.fotos.map((foto, fotoIndex) => `
                    <div class="foto-container">
                        <img
                            src="${foto}"
                            class="foto-imovel"
                            data-foto="${foto}"
                            data-index="${fotoIndex}"
                            alt="Foto do imóvel"
                        >

                        <button
                            type="button"
                            class="btn-ampliar-foto"
                            data-foto="${foto}"
                            title="Ampliar foto"
                        >
                            🔍
                        </button>
                    </div>
                `).join("")}
            </div>
        `;

    } else {

        fotosHTML = `
            <div class="sem-foto">
                🏠 Sem foto
            </div>
        `;
    }

    card.innerHTML = `
        ${fotosHTML}

        <div class="dados-imovel">

            <h3>${imovel.tipo || "Imóvel"}</h3>

            <p>
                <strong>📍 Endereço:</strong>
                ${imovel.endereco || "Não informado"}
            </p>

            <p>
                <strong>💰 Preço:</strong>
                ${formatarMoeda(imovel.preco)}
            </p>

            ${
                imovel.quartos
                    ? `<p><strong>🛏️ Quartos:</strong> ${imovel.quartos}</p>`
                    : ""
            }

            ${
                imovel.banheiros
                    ? `<p><strong>🚿 Banheiros:</strong> ${imovel.banheiros}</p>`
                    : ""
            }

            ${
                imovel.vagas
                    ? `<p><strong>🚗 Vagas:</strong> ${imovel.vagas}</p>`
                    : ""
            }

            ${
                imovel.area
                    ? `<p><strong>📐 Área:</strong> ${imovel.area} m²</p>`
                    : ""
            }

            ${
                imovel.descricao
                    ? `
                    <p>
                        <strong>📝 Descrição:</strong>
                        ${imovel.descricao}
                    </p>
                    `
                    : ""
            }

            <div class="acoes-imovel">

                <button
                    type="button"
                    class="btn-editar"
                    data-indice="${indice}"
                >
                    ✏️ Editar
                </button>

                <button
                    type="button"
                    class="btn-excluir"
                    data-indice="${indice}"
                >
                    🗑️ Excluir
                </button>

            </div>

        </div>
    `;

    listaImoveis.appendChild(card);

    // ==================================================
    // CLIQUE NAS FOTOS
    // ==================================================

    const fotos = card.querySelectorAll(".foto-imovel");

    fotos.forEach(foto => {

        foto.addEventListener("click", function () {

            const fotoSelecionada = this.dataset.foto;

            abrirFoto(fotoSelecionada);

        });

    });

    // ==================================================
    // BOTÃO DE AMPLIAR
    // ==================================================

    const botoesAmpliar =
        card.querySelectorAll(".btn-ampliar-foto");

    botoesAmpliar.forEach(botao => {

        botao.addEventListener("click", function (event) {

            event.stopPropagation();

            const foto = this.dataset.foto;

            abrirFoto(foto);

        });

    });

    // ==================================================
    // BOTÃO EDITAR
    // ==================================================

    const btnEditar = card.querySelector(".btn-editar");

    btnEditar.addEventListener("click", function () {

        editarImovel(indice);

    });

    // ==================================================
    // BOTÃO EXCLUIR
    // ==================================================

    const btnExcluir = card.querySelector(".btn-excluir");

    btnExcluir.addEventListener("click", function () {

        excluirImovel(indice);

    });
}


// ======================================================
// FORMATAR MOEDA
// ======================================================

function formatarMoeda(valor) {

    if (!valor) {
        return "Não informado";
    }

    const numero = Number(
        String(valor)
            .replace(/\./g, "")
            .replace(",", ".")
    );

    if (isNaN(numero)) {
        return valor;
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ======================================================
// SELEÇÃO DAS FOTOS
// ======================================================

if (campoFotos) {

    campoFotos.addEventListener("change", function () {

        const arquivos = Array.from(this.files);

        if (!arquivos.length) {
            return;
        }

        // Adiciona as novas fotos à lista existente
        arquivos.forEach(arquivo => {

            // Evita adicionar o mesmo arquivo duas vezes
            const existe = fotosSelecionadas.some(
                foto => foto.nome === arquivo.name &&
                        foto.tamanho === arquivo.size
            );

            if (!existe) {

                fotosSelecionadas.push({
                    arquivo: arquivo,
                    nome: arquivo.name,
                    tamanho: arquivo.size
                });

            }

        });

        atualizarPreviewFotos();

        // Limpa o input para permitir selecionar novamente
        // o mesmo arquivo depois
        campoFotos.value = "";
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
        return;
    }

    fotosSelecionadas.forEach((item, index) => {

        const reader = new FileReader();

        reader.onload = function (event) {

            const container =
                document.createElement("div");

            container.className = "preview-foto-item";

            container.innerHTML = `
                <img
                    src="${event.target.result}"
                    class="preview-foto"
                    alt="Prévia da foto ${index + 1}"
                >

                <div class="numero-foto">
                    Foto ${index + 1}
                </div>

                <button
                    type="button"
                    class="btn-remover-foto"
                    data-index="${index}"
                    title="Remover foto"
                >
                    ❌
                </button>
            `;

            previewFotos.appendChild(container);

            // ==========================================
            // CLIQUE NA FOTO DO PREVIEW
            // ==========================================

            const imagem =
                container.querySelector(".preview-foto");

            imagem.addEventListener("click", function () {

                abrirFoto(event.target.result);

            });

            // ==========================================
            // REMOVER FOTO
            // ==========================================

            const botaoRemover =
                container.querySelector(".btn-remover-foto");

            botaoRemover.addEventListener(
                "click",
                function () {

                    const indice =
                        Number(this.dataset.index);

                    fotosSelecionadas.splice(indice, 1);

                    atualizarPreviewFotos();

                }
            );

        };

        reader.readAsDataURL(item.arquivo);

    });
}


// ======================================================
// ABRIR FOTO AMPLIADA
// ======================================================

function abrirFoto(src) {

    if (!modalFoto || !fotoAmpliada) {
        return;
    }

    fotoAmpliada.src = src;

    modalFoto.style.display = "flex";
}


// ======================================================
// FECHAR MODAL DA FOTO
// ======================================================

if (modalFoto) {

    modalFoto.addEventListener("click", function (event) {

        if (
            event.target === modalFoto ||
            event.target.classList.contains("fechar-modal")
        ) {

            fecharFoto();

        }

    });

}


// ======================================================
// FUNÇÃO FECHAR FOTO
// ======================================================

function fecharFoto() {

    if (!modalFoto) {
        return;
    }

    modalFoto.style.display = "none";

    if (fotoAmpliada) {
        fotoAmpliada.src = "";
    }
}


// ======================================================
// SALVAR IMÓVEL
// ======================================================

if (form) {

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        try {

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

            // ==========================================
            // TRANSFORMAR FOTOS EM BASE64
            // ==========================================

            const fotosBase64 = [];

            for (const item of fotosSelecionadas) {

                const base64 =
                    await arquivoParaBase64(item.arquivo);

                fotosBase64.push(base64);

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
                fotos: fotosBase64

            };

            imoveis.push(novoImovel);

            salvarImoveis();

            form.reset();

            fotosSelecionadas = [];

            atualizarPreviewFotos();

            carregarImoveis();

            alert("Imóvel cadastrado com sucesso!");

        } catch (erro) {

            console.error("Erro ao salvar imóvel:", erro);

            alert(
                "Ocorreu um erro ao salvar o imóvel. " +
                "Verifique o console."
            );

        }

    });

}


// ======================================================
// CONVERTER ARQUIVO PARA BASE64
// ======================================================

function arquivoParaBase64(arquivo) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = erro => reject(erro);

        reader.readAsDataURL(arquivo);

    });

}


// ======================================================
// EDITAR IMÓVEL
// ======================================================

function editarImovel(indice) {

    const imovel = imoveis[indice];

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

    // Guarda as fotos antigas para não perdê-las
    imovel.fotos = imovel.fotos || [];

    fotosSelecionadas = [];

    atualizarPreviewFotos();

    // Remove o imóvel antigo
    imoveis.splice(indice, 1);

    salvarImoveis();

    carregarImoveis();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================================================
// EXCLUIR IMÓVEL
// ======================================================

function excluirImovel(indice) {

    const imovel = imoveis[indice];

    if (!imovel) {
        return;
    }

    const confirmar = confirm(
        "Tem certeza que deseja excluir este imóvel?"
    );

    if (!confirmar) {
        return;
    }

    imoveis.splice(indice, 1);

    salvarImoveis();

    carregarImoveis();

}


// ======================================================
// PESQUISA
// ======================================================

if (pesquisa) {

    pesquisa.addEventListener("input", function () {

        carregarImoveis();

    });

}


// ======================================================
// FILTRO POR TIPO
// ======================================================

if (filtroTipo) {

    filtroTipo.addEventListener("change", function () {

        carregarImoveis();

    });

}


// ======================================================
// ESC
// FECHAR MODAL COM ESC
// ======================================================

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        fecharFoto();

    }

});


// ======================================================
// INICIALIZAÇÃO
// ======================================================

carregarImoveis();
