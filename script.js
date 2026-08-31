const form = document.getElementById("formImovel");

const listaImoveis = document.getElementById("listaImoveis");

const pesquisa = document.getElementById("pesquisa");

const filtroTipo = document.getElementById("filtroTipo");

const campoFotos = document.getElementById("fotos");

const previewFotos = document.getElementById("previewFotos");

const modalFoto = document.getElementById("modalFoto");

const fotoAmpliada = document.getElementById("fotoAmpliada");

const fecharModal = document.getElementById("fecharModal");

// Recupera os imóveis já salvos
let imoveis = JSON.parse(localStorage.getItem("imoveis")) || [];

// Controla se estamos editando algum imóvel
let indiceEdicao = -1;

// Fotos selecionadas no formulário
let fotosSelecionadas = [];

// =====================================================
// SALVAR IMÓVEIS
// =====================================================

function salvarImoveis() {

```
localStorage.setItem(
    "imoveis",
    JSON.stringify(imoveis)
);
```

}

// =====================================================
// CONVERTER FOTO PARA BASE64
// =====================================================

function converterFotoParaBase64(arquivo) {

```
return new Promise(function(resolve, reject) {

    const leitor = new FileReader();

    leitor.onload = function() {

        resolve(leitor.result);

    };

    leitor.onerror = function() {

        reject(leitor.error);

    };

    leitor.readAsDataURL(arquivo);

});
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
        Array.from(campoFotos.files);


    if (arquivos.length === 0) {

        return;

    }


    try {

        for (const arquivo of arquivos) {

            if (!arquivo.type.startsWith("image/")) {

                continue;

            }


            const foto =
                await converterFotoParaBase64(
                    arquivo
                );


            fotosSelecionadas.push(foto);

        }


        mostrarPreviewFotos();


    } catch (erro) {

        alert(
            "Não foi possível carregar uma das fotos."
        );

    }


    // Permite selecionar novamente
    campoFotos.value = "";

}
```

);

// =====================================================
// MOSTRAR PREVIEW DAS FOTOS
// =====================================================

function mostrarPreviewFotos() {

```
previewFotos.innerHTML = "";


fotosSelecionadas.forEach(
    function(foto, index) {

        const item =
            document.createElement("div");

        item.classList.add(
            "preview-foto-item"
        );


        const imagem =
            document.createElement("img");

        imagem.src = foto;

        imagem.alt =
            "Prévia da foto " +
            (index + 1);


        item.appendChild(imagem);


        previewFotos.appendChild(item);

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
    pesquisa.value.trim().toLowerCase();


const tipoSelecionado =
    filtroTipo.value.toLowerCase();


const imoveisFiltrados = imoveis.filter(
    function(imovel) {

        const tipo =
            String(imovel.tipo || "").toLowerCase();


        const endereco =
            String(imovel.endereco || "").toLowerCase();


        const correspondePesquisa =
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


// Nenhum resultado
if (imoveisFiltrados.length === 0) {

    listaImoveis.innerHTML =
        "<p>Nenhum imóvel encontrado.</p>";

    return;
}


// Criar cada imóvel
imoveisFiltrados.forEach(
    function(imovel) {

        const index =
            imoveis.indexOf(imovel);


        const card =
            document.createElement("div");

        card.classList.add("imovel");


        // -----------------------------------------
        // TÍTULO
        // -----------------------------------------

        const titulo =
            document.createElement("h3");

        titulo.textContent =
            imovel.tipo || "Imóvel";


        // -----------------------------------------
        // FOTOS
        // -----------------------------------------

        if (
            Array.isArray(imovel.fotos) &&
            imovel.fotos.length > 0
        ) {

            const galeria =
                document.createElement("div");

            galeria.classList.add(
                "galeria-imovel"
            );


            imovel.fotos.forEach(
                function(foto, fotoIndex) {

                    const item =
                        document.createElement("div");

                    item.classList.add(
                        "foto-imovel"
                    );


                    const imagem =
                        document.createElement("img");

                    imagem.src = foto;

                    imagem.alt =
                        "Foto do imóvel";


                    imagem.addEventListener(
                        "click",
                        function() {

                            abrirFoto(foto);

                        }
                    );


                    // Botão excluir foto
                    const botaoExcluirFoto =
                        document.createElement("button");

                    botaoExcluirFoto.textContent =
                        "✕";

                    botaoExcluirFoto.type =
                        "button";

                    botaoExcluirFoto.classList.add(
                        "btn-excluir-foto"
                    );


                    botaoExcluirFoto.title =
                        "Excluir esta foto";


                    botaoExcluirFoto.addEventListener(
                        "click",
                        function(event) {

                            event.stopPropagation();


                            const confirmar =
                                confirm(
                                    "Deseja excluir esta foto?"
                                );


                            if (confirmar) {

                                imovel.fotos.splice(
                                    fotoIndex,
                                    1
                                );


                                salvarImoveis();

                                exibirImoveis();

                            }

                        }
                    );


                    item.appendChild(
                        imagem
                    );

                    item.appendChild(
                        botaoExcluirFoto
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


        // -----------------------------------------
        // ENDEREÇO
        // -----------------------------------------

        const endereco =
            document.createElement("p");

        endereco.innerHTML =
            "<strong>Endereço:</strong> " +
            escaparHTML(imovel.endereco || "");


        // -----------------------------------------
        // PREÇO
        // -----------------------------------------

        const preco =
            document.createElement("p");


        const valorNumerico =
            Number(imovel.preco);


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


        // -----------------------------------------
        // INFORMAÇÕES
        // -----------------------------------------

        const info =
            document.createElement("div");

        info.classList.add("info-imovel");


        // QUARTOS
        if (
            imovel.quartos !== undefined &&
            imovel.quartos !== ""
        ) {

            const itemQuartos =
                document.createElement("span");

            itemQuartos.classList.add("info-item");

            itemQuartos.textContent =
                "🛏️ " +
                imovel.quartos +
                " quarto(s)";

            info.appendChild(itemQuartos);
        }


        // BANHEIROS
        if (
            imovel.banheiros !== undefined &&
            imovel.banheiros !== ""
        ) {

            const itemBanheiros =
                document.createElement("span");

            itemBanheiros.classList.add("info-item");

            itemBanheiros.textContent =
                "🚿 " +
                imovel.banheiros +
                " banheiro(s)";

            info.appendChild(itemBanheiros);
        }


        // VAGAS
        if (
            imovel.vagas !== undefined &&
            imovel.vagas !== ""
        ) {

            const itemVagas =
                document.createElement("span");

            itemVagas.classList.add("info-item");

            itemVagas.textContent =
                "🚗 " +
                imovel.vagas +
                " vaga(s)";

            info.appendChild(itemVagas);
        }


        // ÁREA
        if (
            imovel.area !== undefined &&
            imovel.area !== ""
        ) {

            const itemArea =
                document.createElement("span");

            itemArea.classList.add("info-item");

            itemArea.textContent =
                "📐 " +
                imovel.area +
                " m²";

            info.appendChild(itemArea);
        }


        // -----------------------------------------
        // DESCRIÇÃO
        // -----------------------------------------

        let descricao = null;


        if (
            imovel.descricao &&
            imovel.descricao.trim() !== ""
        ) {

            descricao =
                document.createElement("div");

            descricao.classList.add("descricao");


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

        }


        // -----------------------------------------
        // BOTÕES
        // -----------------------------------------

        const botoes =
            document.createElement("div");

        botoes.classList.add("botoes");


        // BOTÃO EDITAR
        const botaoEditar =
            document.createElement("button");

        botaoEditar.textContent =
            "Editar";

        botaoEditar.classList.add(
            "btn-editar"
        );


        botaoEditar.addEventListener(
            "click",
            function() {

                editarImovel(index);

            }
        );


        // BOTÃO EXCLUIR
        const botaoExcluir =
            document.createElement("button");

        botaoExcluir.textContent =
            "Excluir";

        botaoExcluir.classList.add(
            "btn-excluir"
        );


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


        // -----------------------------------------
        // MONTAR CARD
        // -----------------------------------------

        card.appendChild(titulo);

        card.appendChild(endereco);

        card.appendChild(preco);


        if (info.children.length > 0) {

            card.appendChild(info);

        }


        if (descricao) {

            card.appendChild(descricao);

        }


        card.appendChild(botoes);


        listaImoveis.appendChild(card);

    }
);
```

}

// =====================================================
// CADASTRAR / ATUALIZAR IMÓVEL
// =====================================================

form.addEventListener(
"submit",
async function(event) {

```
    event.preventDefault();


    // Campos principais
    const tipo =
        document.getElementById("tipo").value;


    const endereco =
        document
            .getElementById("endereco")
            .value
            .trim();


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
        document
            .getElementById("descricao")
            .value
            .trim();


    // Verificação dos campos obrigatórios
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


    // -----------------------------------------
    // FOTOS
    // -----------------------------------------

    let fotos = [];


    // Se estiver editando, mantém as fotos existentes
    if (indiceEdicao !== -1) {

        const imovelExistente =
            imoveis[indiceEdicao];


        if (
            imovelExistente &&
            Array.isArray(imovelExistente.fotos)
        ) {

            fotos =
                [...imovelExistente.fotos];

        }

    }


    // Adiciona novas fotos
    if (fotosSelecionadas.length > 0) {

        fotos =
            fotos.concat(
                fotosSelecionadas
            );

    }


    // Objeto do imóvel
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


    // -----------------------------------------
    // NOVO IMÓVEL
    // -----------------------------------------

    if (indiceEdicao === -1) {

        imoveis.push(
            imovelAtualizado
        );


        alert(
            "Imóvel cadastrado com sucesso!"
        );

    }


    // -----------------------------------------
    // EDITAR IMÓVEL
    // -----------------------------------------

    else {

        imoveis[indiceEdicao] =
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


    // Salvar
    salvarImoveis();


    // Limpar formulário
    form.reset();


    fotosSelecionadas = [];

    previewFotos.innerHTML = "";


    // Atualizar lista
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


// Campos
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


// Não coloca novamente as fotos antigas
// no campo de seleção.
fotosSelecionadas = [];

previewFotos.innerHTML = "";


// Define índice que será editado
indiceEdicao = index;


// Alterar texto do botão
form.querySelector(
    "button[type='submit']"
).textContent =
    "Salvar alteração";


// Rolar até o formulário
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


if (confirmar) {

    imoveis.splice(index, 1);


    salvarImoveis();


    exibirImoveis();


    alert(
        "Imóvel excluído com sucesso!"
    );

}
```

}

// =====================================================
// ABRIR FOTO AMPLIADA
// =====================================================

function abrirFoto(foto) {

```
fotoAmpliada.src = foto;

modalFoto.classList.add("ativo");
```

}

// =====================================================
// FECHAR FOTO
// =====================================================

fecharModal.addEventListener(
"click",
function() {

```
    modalFoto.classList.remove("ativo");

    fotoAmpliada.src = "";

}
```

);

// Fechar clicando no fundo
modalFoto.addEventListener(
"click",
function(event) {

```
    if (event.target === modalFoto) {

        modalFoto.classList.remove(
            "ativo"
        );

        fotoAmpliada.src = "";

    }

}
```

);

// Fechar com ESC
document.addEventListener(
"keydown",
function(event) {

```
    if (
        event.key === "Escape" &&
        modalFoto.classList.contains("ativo")
    ) {

        modalFoto.classList.remove(
            "ativo"
        );

        fotoAmpliada.src = "";

    }

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
// PROTEÇÃO CONTRA HTML INDESEJADO
// =====================================================

function escaparHTML(texto) {

```
const div =
    document.createElement("div");

div.textContent =
    texto;

return div.innerHTML;
```

}

// =====================================================
// INICIAR
// =====================================================

exibirImoveis();
