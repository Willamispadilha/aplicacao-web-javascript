const form = document.getElementById("formImovel");
const listaImoveis = document.getElementById("listaImoveis");
const pesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtroTipo");

const campoFotos = document.getElementById("fotos");
const previewFotos = document.getElementById("previewFotos");

const modalFoto = document.getElementById("modalFoto");
const fotoAmpliada = document.getElementById("fotoAmpliada");
const fecharModal = document.getElementById("fecharModal");

// =====================================================
// RECUPERAR IMÓVEIS
// =====================================================

let imoveis = [];

try {

```
imoveis =
    JSON.parse(
        localStorage.getItem("imoveis")
    ) || [];
```

} catch (erro) {

```
console.error(
    "Erro ao recuperar imóveis:",
    erro
);

imoveis = [];
```

}

// =====================================================
// CONTROLES
// =====================================================

let indiceEdicao = -1;

let fotosSelecionadas = [];

// =====================================================
// SALVAR IMÓVEIS
// =====================================================

function salvarImoveis() {

```
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
        "Não foi possível salvar as fotos. " +
        "Isso pode acontecer quando as imagens são muito grandes. " +
        "Tente usar fotos menores."
    );

    return false;

}
```

}

// =====================================================
// CONVERTER FOTO PARA BASE64
// =====================================================

function converterFotoParaBase64(arquivo) {

```
return new Promise(
    function(resolve, reject) {

        const leitor =
            new FileReader();

        leitor.onload =
            function() {

                resolve(
                    leitor.result
                );

            };

        leitor.onerror =
            function() {

                reject(
                    leitor.error
                );

            };

        leitor.readAsDataURL(
            arquivo
        );

    }
);
```

}

// =====================================================
// SELECIONAR FOTOS
// =====================================================

campoFotos.addEventListener(
"change",
async function() {

```
    const arquivos =
        Array.from(
            campoFotos.files
        );


    if (
        arquivos.length === 0
    ) {

        return;

    }


    try {

        for (
            const arquivo of arquivos
        ) {

            if (
                !arquivo.type.startsWith(
                    "image/"
                )
            ) {

                continue;

            }


            const foto =
                await converterFotoParaBase64(
                    arquivo
                );


            fotosSelecionadas.push(
                foto
            );

        }


        mostrarPreviewFotos();

    } catch (erro) {

        console.error(
            erro
        );

        alert(
            "Não foi possível carregar uma das fotos."
        );

    }


    // Permite escolher mais fotos depois
    campoFotos.value = "";

}
```

);

// =====================================================
// MOSTRAR PREVIEW
// =====================================================

function mostrarPreviewFotos() {

```
previewFotos.innerHTML = "";


fotosSelecionadas.forEach(
    function(foto, index) {

        const item =
            document.createElement(
                "div"
            );

        item.classList.add(
            "preview-foto-item"
        );


        const imagem =
            document.createElement(
                "img"
            );

        imagem.src =
            foto;

        imagem.alt =
            "Prévia da foto " +
            (index + 1);


        item.appendChild(
            imagem
        );


        previewFotos.appendChild(
            item
        );

    }
);
```

}

// =====================================================
// EXIBIR IMÓVEIS
// =====================================================

function exibirImoveis() {

```
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
                tipo.includes(
                    textoPesquisa
                ) ||
                endereco.includes(
                    textoPesquisa
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


if (
    imoveisFiltrados.length === 0
) {

    listaImoveis.innerHTML =
        "<p>Nenhum imóvel encontrado.</p>";

    return;

}


imoveisFiltrados.forEach(
    function(imovel) {

        const index =
            imoveis.indexOf(
                imovel
            );


        const card =
            document.createElement(
                "div"
            );

        card.classList.add(
            "imovel"
        );


        // =================================================
        // TÍTULO
        // =================================================

        const titulo =
            document.createElement(
                "h3"
            );

        titulo.textContent =
            imovel.tipo ||
            "Imóvel";


        card.appendChild(
            titulo
        );


        // =================================================
        // FOTOS
        // =================================================

        if (
            Array.isArray(
                imovel.fotos
            ) &&
            imovel.fotos.length > 0
        ) {

            const galeria =
                document.createElement(
                    "div"
                );

            galeria.classList.add(
                "galeria-imovel"
            );


            imovel.fotos.forEach(
                function(
                    foto,
                    fotoIndex
                ) {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.classList.add(
                        "foto-imovel"
                    );


                    // -----------------------------------------
                    // FOTO PRINCIPAL
                    // -----------------------------------------

                    if (
                        fotoIndex ===
                        obterIndiceFotoPrincipal(
                            imovel
                        )
                    ) {

                        item.classList.add(
                            "foto-principal"
                        );

                    }


                    // -----------------------------------------
                    // IMAGEM
                    // -----------------------------------------

                    const imagem =
                        document.createElement(
                            "img"
                        );

                    imagem.src =
                        foto;

                    imagem.alt =
                        "Foto do imóvel";


                    imagem.addEventListener(
                        "click",
                        function() {

                            abrirFoto(
                                foto
                            );

                        }
                    );


                    item.appendChild(
                        imagem
                    );


                    // -----------------------------------------
                    // ETIQUETA PRINCIPAL
                    // -----------------------------------------

                    if (
                        fotoIndex ===
                        obterIndiceFotoPrincipal(
                            imovel
                        )
                    ) {

                        const etiqueta =
                            document.createElement(
                                "span"
                            );

                        etiqueta.classList.add(
                            "etiqueta-principal"
                        );

                        etiqueta.textContent =
                            "⭐ Principal";


                        item.appendChild(
                            etiqueta
                        );

                    }


                    // -----------------------------------------
                    // BOTÕES DA FOTO
                    // -----------------------------------------

                    const botoesFoto =
                        document.createElement(
                            "div"
                        );

                    botoesFoto.classList.add(
                        "botoes-foto"
                    );


                    // BOTÃO PRINCIPAL

                    const botaoPrincipal =
                        document.createElement(
                            "button"
                        );

                    botaoPrincipal.type =
                        "button";

                    botaoPrincipal.classList.add(
                        "btn-foto",
                        "btn-principal"
                    );

                    botaoPrincipal.textContent =
                        "⭐";

                    botaoPrincipal.title =
                        "Definir como foto principal";


                    botaoPrincipal.addEventListener(
                        "click",
                        function(event) {

                            event.preventDefault();

                            event.stopPropagation();


                            imovel.fotoPrincipal =
                                fotoIndex;


                            salvarImoveis();

                            exibirImoveis();

                        }
                    );


                    // BOTÃO EXCLUIR

                    const botaoExcluirFoto =
                        document.createElement(
                            "button"
                        );

                    botaoExcluirFoto.type =
                        "button";

                    botaoExcluirFoto.classList.add(
                        "btn-foto",
                        "btn-excluir-foto"
                    );

                    botaoExcluirFoto.textContent =
                        "✕";

                    botaoExcluirFoto.title =
                        "Excluir esta foto";


                    botaoExcluirFoto.addEventListener(
                        "click",
                        function(event) {

                            event.preventDefault();

                            event.stopPropagation();


                            const confirmar =
                                confirm(
                                    "Deseja excluir esta foto?"
                                );


                            if (
                                !confirmar
                            ) {

                                return;

                            }


                            const eraPrincipal =
                                obterIndiceFotoPrincipal(
                                    imovel
                                ) === fotoIndex;


                            imovel.fotos.splice(
                                fotoIndex,
                                1
                            );


                            // Ajustar foto principal
                            if (
                                imovel.fotos.length === 0
                            ) {

                                delete imovel.fotoPrincipal;

                            } else if (
                                eraPrincipal
                            ) {

                                imovel.fotoPrincipal =
                                    0;

                            } else if (
                                imovel.fotoPrincipal >
                                fotoIndex
                            ) {

                                imovel.fotoPrincipal--;

                            }


                            salvarImoveis();

                            exibirImoveis();

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


                    galeria.appendChild(
                        item
                    );

                }
            );


            card.appendChild(
                galeria
            );

        }


        // =================================================
        // ENDEREÇO
        // =================================================

        const endereco =
            document.createElement(
                "p"
            );

        endereco.innerHTML =
            "<strong>Endereço:</strong> " +
            escaparHTML(
                imovel.endereco || ""
            );


        card.appendChild(
            endereco
        );


        // =================================================
        // PREÇO
        // =================================================

        const preco =
            document.createElement(
                "p"
            );


        const valorNumerico =
            Number(
                imovel.preco
            );


        preco.innerHTML =
            "<strong>Preço:</strong> R$ " +
            (
                isNaN(valorNumerico)
                ? "0,00"
                : valorNumerico.toLocaleString(
                    "pt-BR",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )
            );


        card.appendChild(
            preco
        );


        // =================================================
        // INFORMAÇÕES
        // =================================================

        const info =
            document.createElement(
                "div"
            );

        info.classList.add(
            "info-imovel"
        );


        if (
            imovel.quartos !== undefined &&
            imovel.quartos !== ""
        ) {

            const item =
                document.createElement(
                    "span"
                );

            item.classList.add(
                "info-item"
            );

            item.textContent =
                "🛏️ " +
                imovel.quartos +
                " quarto(s)";

            info.appendChild(
                item
            );

        }


        if (
            imovel.banheiros !== undefined &&
            imovel.banheiros !== ""
        ) {

            const item =
                document.createElement(
                    "span"
                );

            item.classList.add(
                "info-item"
            );

            item.textContent =
                "🚿 " +
                imovel.banheiros +
                " banheiro(s)";

            info.appendChild(
                item
            );

        }


        if (
            imovel.vagas !== undefined &&
            imovel.vagas !== ""
        ) {

            const item =
                document.createElement(
                    "span"
                );

            item.classList.add(
                "info-item"
            );

            item.textContent =
                "🚗 " +
                imovel.vagas +
                " vaga(s)";

            info.appendChild(
                item
            );

        }


        if (
            imovel.area !== undefined &&
            imovel.area !== ""
        ) {

            const item =
                document.createElement(
                    "span"
                );

            item.classList.add(
                "info-item"
            );

            item.textContent =
                "📐 " +
                imovel.area +
                " m²";

            info.appendChild(
                item
            );

        }


        if (
            info.children.length > 0
        ) {

            card.appendChild(
                info
            );

        }


        // =================================================
        // DESCRIÇÃO
        // =================================================

        if (
            imovel.descricao &&
            imovel.descricao.trim() !== ""
        ) {

            const descricao =
                document.createElement(
                    "div"
                );

            descricao.classList.add(
                "descricao"
            );


            const tituloDescricao =
                document.createElement(
                    "strong"
                );

            tituloDescricao.textContent =
                "Descrição:";


            const textoDescricao =
                document.createElement(
                    "span"
                );

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


        // =================================================
        // BOTÕES
        // =================================================

        const botoes =
            document.createElement(
                "div"
            );

        botoes.classList.add(
            "botoes"
        );


        // EDITAR

        const botaoEditar =
            document.createElement(
                "button"
            );

        botaoEditar.type =
            "button";

        botaoEditar.textContent =
            "✏️ Editar";

        botaoEditar.classList.add(
            "btn-editar"
        );


        botaoEditar.addEventListener(
            "click",
            function() {

                editarImovel(
                    index
                );

            }
        );


        // EXCLUIR

        const botaoExcluir =
            document.createElement(
                "button"
            );

        botaoExcluir.type =
            "button";

        botaoExcluir.textContent =
            "🗑️ Excluir";

        botaoExcluir.classList.add(
            "btn-excluir"
        );


        botaoExcluir.addEventListener(
            "click",
            function() {

                excluirImovel(
                    index
                );

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
```

}

// =====================================================
// OBTER FOTO PRINCIPAL
// =====================================================

function obterIndiceFotoPrincipal(imovel) {

```
if (
    !Array.isArray(
        imovel.fotos
    ) ||
    imovel.fotos.length === 0
) {

    return -1;

}


const indice =
    Number(
        imovel.fotoPrincipal
    );


if (
    Number.isInteger(indice) &&
    indice >= 0 &&
    indice < imovel.fotos.length
) {

    return indice;

}


// Imóveis antigos:
// a primeira foto passa a ser principal

return 0;
```

}

// =====================================================
// CADASTRAR / ATUALIZAR
// =====================================================

form.addEventListener(
"submit",
async function(event) {

```
    event.preventDefault();


    const tipo =
        document.getElementById(
            "tipo"
        ).value;


    const endereco =
        document.getElementById(
            "endereco"
        ).value.trim();


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
        ).value.trim();


    // =================================================
    // VERIFICAÇÃO
    // =================================================

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


    // =================================================
    // FOTOS EXISTENTES
    // =================================================

    let fotos = [];

    let fotoPrincipal = 0;


    if (
        indiceEdicao !== -1
    ) {

        const imovelExistente =
            imoveis[
                indiceEdicao
            ];


        if (
            imovelExistente
        ) {

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


            fotoPrincipal =
                obterIndiceFotoPrincipal(
                    imovelExistente
                );

        }

    }


    // =================================================
    // ADICIONAR NOVAS FOTOS
    // =================================================

    if (
        fotosSelecionadas.length > 0
    ) {

        fotos =
            fotos.concat(
                fotosSelecionadas
            );

    }


    // =================================================
    // NOVO IMÓVEL
    // =================================================

    if (
        indiceEdicao === -1
    ) {

        if (
            fotos.length > 0
        ) {

            fotoPrincipal = 0;

        } else {

            fotoPrincipal = -1;

        }

    }


    // =================================================
    // OBJETO
    // =================================================

    const imovelAtualizado = {

        tipo: tipo,

        endereco: endereco,

        preco: preco,

        quartos: quartos,

        banheiros: banheiros,

        vagas: vagas,

        area: area,

        descricao: descricao,

        fotos: fotos

    };


    if (
        fotoPrincipal >= 0 &&
        fotos.length > 0
    ) {

        imovelAtualizado.fotoPrincipal =
            fotoPrincipal;

    }


    // =================================================
    // NOVO
    // =================================================

    if (
        indiceEdicao === -1
    ) {

        imoveis.push(
            imovelAtualizado
        );


        alert(
            "Imóvel cadastrado com sucesso!"
        );

    }


    // =================================================
    // EDITAR
    // =================================================

    else {

        imoveis[
            indiceEdicao
        ] =
            imovelAtualizado;


        indiceEdicao = -1;


        form.querySelector(
            "button[type='submit']"
        ).textContent =
            "Cadastrar imóvel";


        alert(
            "Imóvel atualizado com sucesso!"
        );

    }


    // =================================================
    // SALVAR
    // =================================================

    const salvou =
        salvarImoveis();


    if (
        !salvou
    ) {

        return;

    }


    // =================================================
    // LIMPAR FORMULÁRIO
    // =================================================

    form.reset();

    fotosSelecionadas = [];

    previewFotos.innerHTML = "";


    // =================================================
    // ATUALIZAR LISTA
    // =================================================

    exibirImoveis();

}
```

);

// =====================================================
// EDITAR IMÓVEL
// =====================================================

function editarImovel(index) {

```
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


// Fotos novas começam vazias

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
```

}

// =====================================================
// EXCLUIR IMÓVEL
// =====================================================

function excluirImovel(index) {

```
const confirmar =
    confirm(
        "Deseja realmente excluir este imóvel?"
    );


if (!confirmar) {

    return;

}


imoveis.splice(
    index,
    1
);


salvarImoveis();

exibirImoveis();


alert(
    "Imóvel excluído com sucesso!"
);
```

}

// =====================================================
// ABRIR FOTO
// =====================================================

function abrirFoto(foto) {

```
if (
    !foto ||
    typeof foto !== "string"
) {

    return;

}


fotoAmpliada.src =
    foto;


fotoAmpliada.alt =
    "Foto ampliada do imóvel";


modalFoto.classList.add(
    "ativo"
);
```

}

// =====================================================
// FECHAR FOTO
// =====================================================

function fecharFoto() {

```
modalFoto.classList.remove(
    "ativo"
);


fotoAmpliada.src =
    "";
```

}

// =====================================================
// BOTÃO X
// =====================================================

fecharModal.addEventListener(
"click",
function(event) {

```
    event.preventDefault();

    event.stopPropagation();

    fecharFoto();

}
```

);

// =====================================================
// CLICAR NO FUNDO
// =====================================================

modalFoto.addEventListener(
"click",
function(event) {

```
    if (
        event.target === modalFoto
    ) {

        fecharFoto();

    }

}
```

);

// =====================================================
// ESC
// =====================================================

document.addEventListener(
"keydown",
function(event) {

```
    if (
        event.key === "Escape" &&
        modalFoto.classList.contains(
            "ativo"
        )
    ) {

        fecharFoto();

    }

}
```

);

// =====================================================
// ERRO AO CARREGAR FOTO
// =====================================================

fotoAmpliada.addEventListener(
"error",
function() {

```
    fecharFoto();

}
```

);

// =====================================================
// PESQUISA
// =====================================================

pesquisa.addEventListener(
"input",
function() {

```
    exibirImoveis();

}
```

);

// =====================================================
// FILTRO POR TIPO
// =====================================================

filtroTipo.addEventListener(
"change",
function() {

```
    exibirImoveis();

}
```

);

// =====================================================
// PROTEÇÃO CONTRA HTML
// =====================================================

function escaparHTML(texto) {

```
const div =
    document.createElement(
        "div"
    );


div.textContent =
    texto;


return div.innerHTML;
```

}

// =====================================================
// INICIAR SITE
// =====================================================

exibirImoveis();
