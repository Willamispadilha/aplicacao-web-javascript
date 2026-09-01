const form = document.getElementById("formImovel");
const listaImoveis = document.getElementById("listaImoveis");
const pesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtroTipo");

const campoFotos = document.getElementById("fotos");
const previewFotos = document.getElementById("previewFotos");

const modalFoto = document.getElementById("modalFoto");
const fotoAmpliada = document.getElementById("fotoAmpliada");
const fecharModal = document.getElementById("fecharModal");

let imoveis = [];
let indiceEdicao = -1;
let fotosSelecionadas = [];

let fotoModalIndex = 0;
let fotosModalAtual = [];


/* =====================================================
   CARREGAR IMÓVEIS
===================================================== */

function carregarImoveis() {

    try {

        const dadosSalvos = localStorage.getItem("imoveis");

        if (!dadosSalvos) {
            imoveis = [];
            return;
        }

        const dados = JSON.parse(dadosSalvos);

        if (Array.isArray(dados)) {
            imoveis = dados;
        } else {
            imoveis = [];
        }

    } catch (erro) {

        console.error("Erro ao carregar imóveis:", erro);

        imoveis = [];
    }
}


/* =====================================================
   SALVAR IMÓVEIS
===================================================== */

function salvarImoveis() {

    try {

        localStorage.setItem(
            "imoveis",
            JSON.stringify(imoveis)
        );

        return true;

    } catch (erro) {

        console.error("Erro ao salvar imóveis:", erro);

        alert(
            "Não foi possível salvar os dados. " +
            "As fotos podem estar ocupando muito espaço. " +
            "Tente utilizar imagens menores."
        );

        return false;
    }
}


/* =====================================================
   REDUZIR FOTO
===================================================== */

function reduzirFoto(arquivo) {

    return new Promise(function(resolve, reject) {

        const leitor = new FileReader();

        leitor.onload = function(event) {

            const imagem = new Image();

            imagem.onload = function() {

                const tamanhoMaximo = 1600;

                let largura = imagem.width;
                let altura = imagem.height;

                if (
                    largura > tamanhoMaximo ||
                    altura > tamanhoMaximo
                ) {

                    if (largura > altura) {

                        altura =
                            altura *
                            (tamanhoMaximo / largura);

                        largura = tamanhoMaximo;

                    } else {

                        largura =
                            largura *
                            (tamanhoMaximo / altura);

                        altura = tamanhoMaximo;
                    }
                }

                const canvas =
                    document.createElement("canvas");

                canvas.width = Math.round(largura);
                canvas.height = Math.round(altura);

                const contexto =
                    canvas.getContext("2d");

                contexto.drawImage(
                    imagem,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const resultado =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.78
                    );

                resolve(resultado);
            };

            imagem.onerror = function() {

                reject(
                    new Error(
                        "Não foi possível processar a imagem."
                    )
                );
            };

            imagem.src = event.target.result;
        };

        leitor.onerror = function() {
            reject(leitor.error);
        };

        leitor.readAsDataURL(arquivo);
    });
}


/* =====================================================
   SELECIONAR FOTOS NOVAS
===================================================== */

campoFotos.addEventListener(
    "change",
    async function() {

        const arquivos =
            Array.from(campoFotos.files);

        if (arquivos.length === 0) {
            return;
        }

        try {

            for (const arquivo of arquivos) {

                if (
                    !arquivo.type.startsWith("image/")
                ) {
                    continue;
                }

                if (
                    arquivo.size >
                    10 * 1024 * 1024
                ) {

                    alert(
                        "A foto \"" +
                        arquivo.name +
                        "\" é muito grande. " +
                        "Escolha uma foto de até 10 MB."
                    );

                    continue;
                }

                const foto =
                    await reduzirFoto(arquivo);

                fotosSelecionadas.push(foto);
            }

            mostrarPreviewFotos();

        } catch (erro) {

            console.error(
                "Erro ao carregar foto:",
                erro
            );

            alert(
                "Não foi possível carregar uma das fotos."
            );
        }

        campoFotos.value = "";
    }
);


/* =====================================================
   PREVIEW DAS FOTOS NOVAS
===================================================== */

function mostrarPreviewFotos() {

    previewFotos.innerHTML = "";

    fotosSelecionadas.forEach(
        function(foto, index) {

            const item =
                document.createElement("div");

            item.className =
                "preview-foto-item";

            item.style.position = "relative";

            const imagem =
                document.createElement("img");

            imagem.src = foto;

            imagem.alt =
                "Prévia da foto " +
                (index + 1);

            imagem.style.cursor = "pointer";

            item.appendChild(imagem);

            /*
             * Botão de excluir a foto
             */

            const excluir =
                document.createElement("button");

            excluir.type = "button";

            excluir.textContent = "✕";

            excluir.title = "Remover foto";

            excluir.style.position = "absolute";
            excluir.style.top = "5px";
            excluir.style.right = "5px";
            excluir.style.padding = "4px 8px";
            excluir.style.fontSize = "12px";
            excluir.style.background = "#d9534f";
            excluir.style.color = "#fff";

            excluir.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    fotosSelecionadas.splice(
                        index,
                        1
                    );

                    mostrarPreviewFotos();
                }
            );

            item.appendChild(excluir);

            previewFotos.appendChild(item);
        }
    );
}


/* =====================================================
   ÍNDICE DA FOTO PRINCIPAL
===================================================== */

function obterIndiceFotoPrincipal(imovel) {

    if (
        !Array.isArray(imovel.fotos) ||
        imovel.fotos.length === 0
    ) {
        return -1;
    }

    /*
     * Fotos antigas que não possuem
     * fotoPrincipal usam a primeira.
     */

    if (
        !Number.isInteger(imovel.fotoPrincipal) ||
        imovel.fotoPrincipal < 0 ||
        imovel.fotoPrincipal >= imovel.fotos.length
    ) {

        return 0;
    }

    return imovel.fotoPrincipal;
}


/* =====================================================
   FOTOS ORDENADAS
===================================================== */

function obterFotosOrdenadas(imovel) {

    if (
        !Array.isArray(imovel.fotos)
    ) {
        return [];
    }

    const indicePrincipal =
        obterIndiceFotoPrincipal(imovel);

    const resultado = [];

    /*
     * Primeiro coloca a principal
     */

    if (indicePrincipal >= 0) {

        resultado.push({
            foto: imovel.fotos[indicePrincipal],
            index: indicePrincipal
        });
    }

    /*
     * Depois coloca as demais
     */

    imovel.fotos.forEach(
        function(foto, index) {

            if (index !== indicePrincipal) {

                resultado.push({
                    foto: foto,
                    index: index
                });
            }
        }
    );

    return resultado;
}


/* =====================================================
   DEFINIR FOTO PRINCIPAL
===================================================== */

function definirFotoPrincipal(
    indexImovel,
    indexFoto
) {

    const imovel =
        imoveis[indexImovel];

    if (!imovel) {
        return;
    }

    if (
        !Array.isArray(imovel.fotos)
    ) {
        return;
    }

    if (
        indexFoto < 0 ||
        indexFoto >= imovel.fotos.length
    ) {
        return;
    }

    /*
     * Salva qual foto é a principal.
     */

    imovel.fotoPrincipal = indexFoto;

    /*
     * Salva imediatamente.
     */

    if (!salvarImoveis()) {
        return;
    }

    /*
     * Atualiza a tela.
     */

    exibirImoveis();
}


/* =====================================================
   EXCLUIR FOTO
===================================================== */

function excluirFoto(
    indexImovel,
    indexFoto
) {

    const imovel =
        imoveis[indexImovel];

    if (!imovel) {
        return;
    }

    if (
        !Array.isArray(imovel.fotos)
    ) {
        return;
    }

    if (
        indexFoto < 0 ||
        indexFoto >= imovel.fotos.length
    ) {
        return;
    }

    const confirmar =
        confirm(
            "Deseja excluir esta foto?"
        );

    if (!confirmar) {
        return;
    }

    const indicePrincipal =
        obterIndiceFotoPrincipal(imovel);

    /*
     * Remove a foto.
     */

    imovel.fotos.splice(
        indexFoto,
        1
    );

    /*
     * Ajusta a foto principal.
     */

    if (imovel.fotos.length === 0) {

        delete imovel.fotoPrincipal;

    } else if (
        indexFoto === indicePrincipal
    ) {

        /*
         * Se apagou a principal,
         * a primeira passa a ser principal.
         */

        imovel.fotoPrincipal = 0;

    } else if (
        indexFoto < indicePrincipal
    ) {

        /*
         * Se apagou uma foto antes da principal,
         * o índice da principal diminui 1.
         */

        imovel.fotoPrincipal =
            indicePrincipal - 1;

    } else {

        /*
         * Mantém a principal.
         */

        imovel.fotoPrincipal =
            indicePrincipal;
    }

    if (!salvarImoveis()) {
        return;
    }

    exibirImoveis();
}


/* =====================================================
   ADICIONAR FOTOS AO IMÓVEL EXISTENTE
===================================================== */

function adicionarFotosAoImovel(indexImovel) {

    const imovel =
        imoveis[indexImovel];

    if (!imovel) {
        return;
    }

    const input =
        document.createElement("input");

    input.type = "file";

    input.accept =
        "image/jpeg,image/png,image/webp";

    input.multiple = true;

    input.style.display = "none";

    document.body.appendChild(input);

    input.addEventListener(
        "change",
        async function() {

            const arquivos =
                Array.from(input.files);

            if (arquivos.length === 0) {

                document.body.removeChild(input);

                return;
            }

            if (
                !Array.isArray(imovel.fotos)
            ) {

                imovel.fotos = [];
            }

            const fotosAntigas =
                [...imovel.fotos];

            const principalAntiga =
                obterIndiceFotoPrincipal(imovel);

            try {

                for (const arquivo of arquivos) {

                    if (
                        !arquivo.type.startsWith("image/")
                    ) {
                        continue;
                    }

                    if (
                        arquivo.size >
                        10 * 1024 * 1024
                    ) {

                        alert(
                            "A foto \"" +
                            arquivo.name +
                            "\" é muito grande e foi ignorada."
                        );

                        continue;
                    }

                    const foto =
                        await reduzirFoto(arquivo);

                    imovel.fotos.push(foto);
                }

                /*
                 * Se já existia uma foto principal,
                 * ela continua sendo a principal.
                 */

                if (
                    imovel.fotos.length > 0
                ) {

                    if (
                        principalAntiga >= 0 &&
                        principalAntiga < imovel.fotos.length
                    ) {

                        imovel.fotoPrincipal =
                            principalAntiga;

                    } else {

                        imovel.fotoPrincipal = 0;
                    }
                }

                if (!salvarImoveis()) {

                    imovel.fotos =
                        fotosAntigas;

                    imovel.fotoPrincipal =
                        principalAntiga;

                    return;
                }

                exibirImoveis();

                alert(
                    "Fotos adicionadas com sucesso!"
                );

            } catch (erro) {

                console.error(
                    "Erro ao adicionar fotos:",
                    erro
                );

                imovel.fotos =
                    fotosAntigas;

                imovel.fotoPrincipal =
                    principalAntiga;

                alert(
                    "Não foi possível adicionar as fotos."
                );

            } finally {

                if (input.parentNode) {

                    document.body.removeChild(input);
                }
            }
        }
    );

    input.click();
}


/* =====================================================
   EXIBIR IMÓVEIS
===================================================== */

function exibirImoveis() {

    listaImoveis.innerHTML = "";

    const textoPesquisa =
        pesquisa.value
            .trim()
            .toLowerCase();

    const tipoSelecionado =
        filtroTipo.value
            .toLowerCase();

    const imoveisFiltrados =
        imoveis.filter(
            function(imovel) {

                const tipo =
                    String(
                        imovel.tipo || ""
                    ).toLowerCase();

                const endereco =
                    String(
                        imovel.endereco || ""
                    ).toLowerCase();

                const correspondePesquisa =
                    textoPesquisa === "" ||
                    tipo.includes(textoPesquisa) ||
                    endereco.includes(textoPesquisa);

                const correspondeTipo =
                    tipoSelecionado === "" ||
                    tipo === tipoSelecionado;

                return (
                    correspondePesquisa &&
                    correspondeTipo
                );
            }
        );


    /* =================================================
       NENHUM IMÓVEL
    ================================================= */

    if (
        imoveisFiltrados.length === 0
    ) {

        if (imoveis.length === 0) {

            listaImoveis.innerHTML =
                "<p>Nenhum imóvel cadastrado.</p>";

        } else {

            listaImoveis.innerHTML =
                "<p>Nenhum imóvel encontrado.</p>";
        }

        return;
    }


    /* =================================================
       CARDS
    ================================================= */

    imoveisFiltrados.forEach(
        function(imovel) {

            const index =
                imoveis.indexOf(imovel);

            const card =
                document.createElement("div");

            card.className = "imovel";


            /* =========================================
               TÍTULO
            ========================================= */

            const titulo =
                document.createElement("h3");

            titulo.textContent =
                imovel.tipo || "Imóvel";

            card.appendChild(titulo);


            /* =========================================
               FOTOS
            ========================================= */

            if (
                Array.isArray(imovel.fotos) &&
                imovel.fotos.length > 0
            ) {

                /*
                 * IMPORTANTE:
                 * Usa as classes do CSS.
                 */

                const galeria =
                    document.createElement("div");

                galeria.className =
                    "galeria-fotos";


                const fotosOrdenadas =
                    obterFotosOrdenadas(imovel);


                fotosOrdenadas.forEach(
                    function(fotoInfo) {

                        const foto =
                            fotoInfo.foto;

                        const fotoIndex =
                            fotoInfo.index;

                        const item =
                            document.createElement("div");

                        item.className =
                            "foto-imovel";

                        item.style.position =
                            "relative";


                        /*
                         * FOTO PRINCIPAL
                         */

                        const principal =
                            fotoIndex ===
                            obterIndiceFotoPrincipal(imovel);

                        if (principal) {

                            item.classList.add(
                                "foto-principal"
                            );
                        }


                        /*
                         * IMAGEM
                         */

                        const imagem =
                            document.createElement("img");

                        imagem.src =
                            foto;

                        imagem.alt =
                            principal
                                ? "Foto principal do imóvel"
                                : "Foto do imóvel";

                        imagem.addEventListener(
                            "click",
                            function() {

                                abrirFoto(
                                    index,
                                    fotoIndex
                                );
                            }
                        );

                        item.appendChild(imagem);


                        /*
                         * ÁREA DOS BOTÕES
                         */

                        const botoesFoto =
                            document.createElement("div");

                        botoesFoto.className =
                            "botoes-foto";

                        botoesFoto.style.position =
                            "absolute";

                        botoesFoto.style.bottom =
                            "5px";

                        botoesFoto.style.left =
                            "5px";

                        botoesFoto.style.display =
                            "flex";

                        botoesFoto.style.gap =
                            "5px";


                        /*
                         * ⭐ ESTRELA
                         */

                        const botaoPrincipal =
                            document.createElement("button");

                        botaoPrincipal.type =
                            "button";

                        botaoPrincipal.className =
                            "btn-foto btn-principal";

                        botaoPrincipal.textContent =
                            principal
                                ? "★"
                                : "☆";

                        botaoPrincipal.title =
                            principal
                                ? "Esta é a foto principal"
                                : "Clique para definir como foto principal";

                        botaoPrincipal.style.padding =
                            "5px 9px";

                        botaoPrincipal.style.fontSize =
                            "16px";

                        botaoPrincipal.style.background =
                            principal
                                ? "#ffc107"
                                : "#ffffff";

                        botaoPrincipal.style.color =
                            principal
                                ? "#ffffff"
                                : "#333333";

                        botaoPrincipal.style.border =
                            "1px solid #ccc";


                        /*
                         * CLIQUE NA ESTRELA
                         */

                        botaoPrincipal.addEventListener(
                            "click",
                            function(event) {

                                event.preventDefault();

                                event.stopPropagation();

                                definirFotoPrincipal(
                                    index,
                                    fotoIndex
                                );
                            }
                        );


                        /*
                         * ❌ EXCLUIR FOTO
                         */

                        const botaoExcluirFoto =
                            document.createElement("button");

                        botaoExcluirFoto.type =
                            "button";

                        botaoExcluirFoto.className =
                            "btn-foto btn-excluir-foto";

                        botaoExcluirFoto.textContent =
                            "✕";

                        botaoExcluirFoto.title =
                            "Excluir esta foto";

                        botaoExcluirFoto.style.padding =
                            "5px 8px";

                        botaoExcluirFoto.style.fontSize =
                            "14px";

                        botaoExcluirFoto.style.background =
                            "#d9534f";

                        botaoExcluirFoto.style.color =
                            "#ffffff";


                        botaoExcluirFoto.addEventListener(
                            "click",
                            function(event) {

                                event.preventDefault();

                                event.stopPropagation();

                                excluirFoto(
                                    index,
                                    fotoIndex
                                );
                            }
                        );


                        botoesFoto.appendChild(
                            botaoPrincipal
                        );

                        botoesFoto.appendChild(
                            botaoExcluirFoto
                        );

                        item.appendChild(
                            botoesFoto
                        );


                        /*
                         * ETIQUETA PRINCIPAL
                         */

                        if (principal) {

                            const etiqueta =
                                document.createElement("span");

                            etiqueta.className =
                                "etiqueta-principal";

                            etiqueta.textContent =
                                "Principal";

                            etiqueta.style.position =
                                "absolute";

                            etiqueta.style.top =
                                "5px";

                            etiqueta.style.left =
                                "5px";

                            etiqueta.style.background =
                                "#ffc107";

                            etiqueta.style.color =
                                "#ffffff";

                            etiqueta.style.padding =
                                "3px 7px";

                            etiqueta.style.borderRadius =
                                "4px";

                            etiqueta.style.fontSize =
                                "11px";

                            etiqueta.style.fontWeight =
                                "bold";

                            item.appendChild(
                                etiqueta
                            );
                        }


                        galeria.appendChild(
                            item
                        );
                    }
                );


                card.appendChild(
                    galeria
                );
            }


            /* =========================================
               ADICIONAR FOTOS
            ========================================= */

            const botoesFotos =
                document.createElement("div");

            botoesFotos.style.marginTop =
                "8px";

            const botaoAdicionarFotos =
                document.createElement("button");

            botaoAdicionarFotos.type =
                "button";

            botaoAdicionarFotos.textContent =
                "📷 Adicionar fotos";

            botaoAdicionarFotos.style.fontSize =
                "14px";

            botaoAdicionarFotos.style.padding =
                "9px 12px";

            botaoAdicionarFotos.addEventListener(
                "click",
                function() {

                    adicionarFotosAoImovel(
                        index
                    );
                }
            );

            botoesFotos.appendChild(
                botaoAdicionarFotos
            );

            card.appendChild(
                botoesFotos
            );


            /* =========================================
               ENDEREÇO
            ========================================= */

            const endereco =
                document.createElement("p");

            const enderecoStrong =
                document.createElement("strong");

            enderecoStrong.textContent =
                "Endereço: ";

            endereco.appendChild(
                enderecoStrong
            );

            endereco.appendChild(
                document.createTextNode(
                    imovel.endereco || ""
                )
            );

            card.appendChild(
                endereco
            );


            /* =========================================
               PREÇO
            ========================================= */

            const preco =
                document.createElement("p");

            const precoStrong =
                document.createElement("strong");

            precoStrong.textContent =
                "Preço: ";

            preco.appendChild(
                precoStrong
            );

            const valorNumerico =
                Number(imovel.preco);

            let valorFormatado;

            if (isNaN(valorNumerico)) {

                valorFormatado = "0,00";

            } else {

                valorFormatado =
                    valorNumerico.toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    );
            }

            preco.appendChild(
                document.createTextNode(
                    "R$ " +
                    valorFormatado
                )
            );

            card.appendChild(
                preco
            );


            /* =========================================
               INFORMAÇÕES
            ========================================= */

            const info =
                document.createElement("div");

            info.className =
                "info-imovel";

            adicionarInformacao(
                info,
                imovel.quartos,
                "🛏️ ",
                " quarto(s)"
            );

            adicionarInformacao(
                info,
                imovel.banheiros,
                "🚿 ",
                " banheiro(s)"
            );

            adicionarInformacao(
                info,
                imovel.vagas,
                "🚗 ",
                " vaga(s)"
            );

            adicionarInformacao(
                info,
                imovel.area,
                "📐 ",
                " m²"
            );

            if (info.children.length > 0) {

                card.appendChild(
                    info
                );
            }


            /* =========================================
               DESCRIÇÃO
            ========================================= */

            if (
                imovel.descricao &&
                imovel.descricao.trim() !== ""
            ) {

                const descricao =
                    document.createElement("div");

                descricao.className =
                    "descricao";

                const tituloDescricao =
                    document.createElement("strong");

                tituloDescricao.textContent =
                    "Descrição:";

                const textoDescricao =
                    document.createElement("span");

                textoDescricao.textContent =
                    imovel.descricao;

                descricao.appendChild(
                    tituloDescricao
                );

                descricao.appendChild(
                    textoDescricao
                );

                card.appendChild(
                    descricao
                );
            }


            /* =========================================
               BOTÕES DO IMÓVEL
            ========================================= */

            const botoes =
                document.createElement("div");

            botoes.className =
                "botoes";


            /*
             * EDITAR
             */

            const botaoEditar =
                document.createElement("button");

            botaoEditar.type =
                "button";

            botaoEditar.textContent =
                "Editar";

            botaoEditar.className =
                "btn-editar";

            botaoEditar.addEventListener(
                "click",
                function() {

                    editarImovel(index);
                }
            );


            /*
             * EXCLUIR
             */

            const botaoExcluir =
                document.createElement("button");

            botaoExcluir.type =
                "button";

            botaoExcluir.textContent =
                "Excluir";

            botaoExcluir.className =
                "btn-excluir";

            botaoExcluir.addEventListener(
                "click",
                function() {

                    excluirImovel(index);
                }
            );

            botoes.appendChild(
                botaoEditar
            );

            botoes.appendChild(
                botaoExcluir
            );

            card.appendChild(
                botoes
            );

            listaImoveis.appendChild(
                card
            );
        }
    );
}


/* =====================================================
   ADICIONAR INFORMAÇÃO
===================================================== */

function adicionarInformacao(
    container,
    valor,
    icone,
    texto
) {

    if (
        valor === undefined ||
        valor === null ||
        valor === ""
    ) {
        return;
    }

    const item =
        document.createElement("span");

    item.className =
        "info-item";

    item.textContent =
        icone +
        valor +
        texto;

    container.appendChild(
        item
    );
}


/* =====================================================
   CADASTRAR / ATUALIZAR
===================================================== */

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const tipo =
            document.getElementById("tipo").value;

        const endereco =
            document.getElementById("endereco")
                .value.trim();

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
            document.getElementById("descricao")
                .value.trim();


        /* =============================================
           VALIDAR
        ============================================= */

        if (
            !tipo ||
            !endereco ||
            !preco
        ) {

            alert(
                "Preencha os campos obrigatórios."
            );

            return;
        }


        /* =============================================
           FOTOS EXISTENTES
        ============================================= */

        let fotos = [];

        let fotoPrincipal =
            undefined;

        if (indiceEdicao !== -1) {

            const imovelExistente =
                imoveis[indiceEdicao];

            if (imovelExistente) {

                if (
                    Array.isArray(
                        imovelExistente.fotos
                    )
                ) {

                    fotos =
                        [
                            ...imovelExistente.fotos
                        ];
                }

                if (
                    Number.isInteger(
                        imovelExistente.fotoPrincipal
                    )
                ) {

                    fotoPrincipal =
                        imovelExistente.fotoPrincipal;
                }
            }
        }


        /* =============================================
           NOVAS FOTOS
        ============================================= */

        if (
            fotosSelecionadas.length > 0
        ) {

            fotos =
                fotos.concat(
                    fotosSelecionadas
                );
        }


        /* =============================================
           FOTO PRINCIPAL
        ============================================= */

        if (
            fotos.length > 0 &&
            !Number.isInteger(fotoPrincipal)
        ) {

            fotoPrincipal = 0;
        }

        if (
            Number.isInteger(fotoPrincipal) &&
            (
                fotoPrincipal < 0 ||
                fotoPrincipal >= fotos.length
            )
        ) {

            fotoPrincipal = 0;
        }


        /* =============================================
           OBJETO
        ============================================= */

        const imovelAtualizado = {

            tipo: tipo,

            endereco: endereco,

            preco: preco,

            quartos: quartos,

            banheiros: banheiros,

            vagas: vagas,

            area: area,

            descricao: descricao,

            fotos: fotos,

            fotoPrincipal:
                fotoPrincipal
        };


        if (
            fotos.length === 0
        ) {

            delete imovelAtualizado.fotoPrincipal;
        }


        /* =============================================
           NOVO
        ============================================= */

        if (
            indiceEdicao === -1
        ) {

            imoveis.push(
                imovelAtualizado
            );

            const salvou =
                salvarImoveis();

            if (!salvou) {

                imoveis.pop();

                return;
            }

            alert(
                "Imóvel cadastrado com sucesso!"
            );

        } else {

            /* =========================================
               ATUALIZAR
            ========================================= */

            const imovelAnterior =
                imoveis[indiceEdicao];

            imoveis[indiceEdicao] =
                imovelAtualizado;

            const salvou =
                salvarImoveis();

            if (!salvou) {

                imoveis[indiceEdicao] =
                    imovelAnterior;

                return;
            }

            indiceEdicao = -1;

            form.querySelector(
                "button[type='submit']"
            ).textContent =
                "Cadastrar imóvel";

            alert(
                "Imóvel atualizado com sucesso!"
            );
        }


        /* =============================================
           LIMPAR
        ============================================= */

        form.reset();

        fotosSelecionadas = [];

        previewFotos.innerHTML = "";

        exibirImoveis();
    }
);


/* =====================================================
   EDITAR IMÓVEL
===================================================== */

function editarImovel(index) {

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

    fotosSelecionadas = [];

    previewFotos.innerHTML = "";

    indiceEdicao = index;

    form.querySelector(
        "button[type='submit']"
    ).textContent =
        "Salvar alteração";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   EXCLUIR IMÓVEL
===================================================== */

function excluirImovel(index) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este imóvel?"
        );

    if (!confirmar) {
        return;
    }

    const imovelRemovido =
        imoveis.splice(index, 1);

    const salvou =
        salvarImoveis();

    if (!salvou) {

        imoveis.splice(
            index,
            0,
            imovelRemovido[0]
        );

        return;
    }

    exibirImoveis();

    alert(
        "Imóvel excluído com sucesso!"
    );
}


/* =====================================================
   ABRIR FOTO
===================================================== */

function abrirFoto(
    indexImovel,
    indexFoto
) {

    const imovel =
        imoveis[indexImovel];

    if (
        !imovel ||
        !Array.isArray(imovel.fotos) ||
        imovel.fotos.length === 0
    ) {
        return;
    }

    fotosModalAtual =
        imovel.fotos;

    fotoModalIndex =
        indexFoto;

    atualizarFotoModal();

    modalFoto.classList.add("ativo");
}


/* =====================================================
   ATUALIZAR FOTO MODAL
===================================================== */

function atualizarFotoModal() {

    if (
        !fotosModalAtual.length
    ) {

        fecharFoto();

        return;
    }

    if (
        fotoModalIndex < 0
    ) {

        fotoModalIndex =
            fotosModalAtual.length - 1;
    }

    if (
        fotoModalIndex >=
        fotosModalAtual.length
    ) {

        fotoModalIndex = 0;
    }

    fotoAmpliada.src =
        fotosModalAtual[fotoModalIndex];

    fotoAmpliada.alt =
        "Foto " +
        (fotoModalIndex + 1) +
        " do imóvel";
}


/* =====================================================
   PRÓXIMA FOTO
===================================================== */

function proximaFoto() {

    if (
        fotosModalAtual.length <= 1
    ) {
        return;
    }

    fotoModalIndex++;

    if (
        fotoModalIndex >=
        fotosModalAtual.length
    ) {

        fotoModalIndex = 0;
    }

    atualizarFotoModal();
}


/* =====================================================
   FOTO ANTERIOR
===================================================== */

function fotoAnterior() {

    if (
        fotosModalAtual.length <= 1
    ) {
        return;
    }

    fotoModalIndex--;

    if (
        fotoModalIndex < 0
    ) {

        fotoModalIndex =
            fotosModalAtual.length - 1;
    }

    atualizarFotoModal();
}


/* =====================================================
   FECHAR FOTO
===================================================== */

function fecharFoto() {

    modalFoto.classList.remove("ativo");

    fotoAmpliada.src = "";

    fotosModalAtual = [];

    fotoModalIndex = 0;
}


/* =====================================================
   CONTROLES DO MODAL
===================================================== */

function criarControlesModal() {

    if (
        document.getElementById(
            "botaoFotoAnterior"
        )
    ) {
        return;
    }

    const anterior =
        document.createElement("button");

    anterior.type = "button";

    anterior.id =
        "botaoFotoAnterior";

    anterior.textContent = "‹";

    anterior.title =
        "Foto anterior";

    anterior.style.position = "fixed";
    anterior.style.left = "20px";
    anterior.style.top = "50%";
    anterior.style.transform = "translateY(-50%)";
    anterior.style.width = "50px";
    anterior.style.height = "50px";
    anterior.style.padding = "0";
    anterior.style.borderRadius = "50%";
    anterior.style.fontSize = "40px";
    anterior.style.lineHeight = "45px";
    anterior.style.zIndex = "100001";

    anterior.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();

            fotoAnterior();
        }
    );


    const proxima =
        document.createElement("button");

    proxima.type = "button";

    proxima.id =
        "botaoFotoProxima";

    proxima.textContent = "›";

    proxima.title =
        "Próxima foto";

    proxima.style.position = "fixed";
    proxima.style.right = "20px";
    proxima.style.top = "50%";
    proxima.style.transform = "translateY(-50%)";
    proxima.style.width = "50px";
    proxima.style.height = "50px";
    proxima.style.padding = "0";
    proxima.style.borderRadius = "50%";
    proxima.style.fontSize = "40px";
    proxima.style.lineHeight = "45px";
    proxima.style.zIndex = "100001";

    proxima.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();

            proximaFoto();
        }
    );

    modalFoto.appendChild(anterior);
    modalFoto.appendChild(proxima);
}


/* =====================================================
   FECHAR MODAL
===================================================== */

fecharModal.addEventListener(
    "click",
    function(event) {

        event.preventDefault();
        event.stopPropagation();

        fecharFoto();
    }
);


/* =====================================================
   CLICAR NO FUNDO DO MODAL
===================================================== */

modalFoto.addEventListener(
    "click",
    function(event) {

        if (
            event.target === modalFoto
        ) {

            fecharFoto();
        }
    }
);


/* =====================================================
   TECLADO
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            !modalFoto.classList.contains("ativo")
        ) {
            return;
        }

        if (
            event.key === "Escape"
        ) {

            fecharFoto();

            return;
        }

        if (
            event.key === "ArrowRight"
        ) {

            proximaFoto();

            return;
        }

        if (
            event.key === "ArrowLeft"
        ) {

            fotoAnterior();

            return;
        }
    }
);


/* =====================================================
   ERRO NA FOTO AMPLIADA
===================================================== */

fotoAmpliada.addEventListener(
    "error",
    function() {

        fecharFoto();
    }
);


/* =====================================================
   PESQUISA
===================================================== */

pesquisa.addEventListener(
    "input",
    function() {

        exibirImoveis();
    }
);


/* =====================================================
   FILTRO
===================================================== */

filtroTipo.addEventListener(
    "change",
    function() {

        exibirImoveis();
    }
);


/* =====================================================
   INICIAR
===================================================== */

criarControlesModal();

carregarImoveis();

exibirImoveis();
