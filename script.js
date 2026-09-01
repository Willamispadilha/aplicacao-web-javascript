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

// CARREGAR IMÓVEIS
function carregarImoveis() {
try {
const dados = localStorage.getItem("imoveis");

```
    if (dados) {
        const convertidos = JSON.parse(dados);

        if (Array.isArray(convertidos)) {
            imoveis = convertidos;
        }
    }
} catch (erro) {
    console.error("Erro ao carregar imóveis:", erro);
    imoveis = [];
}
```

}

carregarImoveis();

// SALVAR IMÓVEIS
function salvarImoveis() {
try {
localStorage.setItem(
"imoveis",
JSON.stringify(imoveis)
);

```
    return true;
} catch (erro) {
    console.error("Erro ao salvar imóveis:", erro);

    alert(
        "Não foi possível salvar. As fotos podem estar muito grandes. Tente usar fotos menores."
    );

    return false;
}
```

}

// CONVERTER FOTO
function converterFotoParaBase64(arquivo) {
return new Promise(function(resolve, reject) {

```
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

// SELECIONAR FOTOS
campoFotos.addEventListener("change", async function() {

```
const arquivos = Array.from(campoFotos.files);

if (arquivos.length === 0) {
    return;
}

try {

    for (const arquivo of arquivos) {

        if (!arquivo.type.startsWith("image/")) {
            continue;
        }

        const foto =
            await converterFotoParaBase64(arquivo);

        fotosSelecionadas.push(foto);
    }

    mostrarPreviewFotos();

} catch (erro) {

    console.error("Erro ao carregar foto:", erro);

    alert(
        "Não foi possível carregar uma das fotos."
    );
}

campoFotos.value = "";
```

});

// PREVIEW DAS FOTOS
function mostrarPreviewFotos() {

```
previewFotos.innerHTML = "";

fotosSelecionadas.forEach(function(foto, index) {

    const item =
        document.createElement("div");

    item.className =
        "preview-foto-item";

    const imagem =
        document.createElement("img");

    imagem.src = foto;

    imagem.alt =
        "Prévia da foto " + (index + 1);

    item.appendChild(imagem);

    previewFotos.appendChild(item);
});
```

}

// EXIBIR IMÓVEIS
function exibirImoveis() {

```
listaImoveis.innerHTML = "";

const textoPesquisa =
    pesquisa.value.trim().toLowerCase();

const tipoSelecionado =
    filtroTipo.value.toLowerCase();

const imoveisFiltrados =
    imoveis.filter(function(imovel) {

        const tipo =
            String(imovel.tipo || "").toLowerCase();

        const endereco =
            String(imovel.endereco || "").toLowerCase();

        const pesquisaOK =
            textoPesquisa === "" ||
            tipo.includes(textoPesquisa) ||
            endereco.includes(textoPesquisa);

        const tipoOK =
            tipoSelecionado === "" ||
            tipo === tipoSelecionado;

        return pesquisaOK && tipoOK;
    });

if (imoveisFiltrados.length === 0) {

    listaImoveis.innerHTML =
        "<p>Nenhum imóvel encontrado.</p>";

    return;
}

imoveisFiltrados.forEach(function(imovel) {

    const index =
        imoveis.indexOf(imovel);

    const card =
        document.createElement("div");

    card.className =
        "imovel";

    const titulo =
        document.createElement("h3");

    titulo.textContent =
        imovel.tipo || "Imóvel";

    card.appendChild(titulo);

    // FOTOS
    if (
        Array.isArray(imovel.fotos) &&
        imovel.fotos.length > 0
    ) {

        const galeria =
            document.createElement("div");

        galeria.className =
            "galeria-imovel";

        imovel.fotos.forEach(function(foto, fotoIndex) {

            const item =
                document.createElement("div");

            item.className =
                "foto-imovel";

            const imagem =
                document.createElement("img");

            imagem.src =
                foto;

            imagem.alt =
                "Foto do imóvel";

            imagem.addEventListener(
                "click",
                function() {
                    abrirFoto(foto);
                }
            );

            const botaoExcluir =
                document.createElement("button");

            botaoExcluir.type =
                "button";

            botaoExcluir.textContent =
                "✕";

            botaoExcluir.className =
                "btn-excluir-foto";

            botaoExcluir.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if (
                        confirm(
                            "Deseja excluir esta foto?"
                        )
                    ) {

                        imovel.fotos.splice(
                            fotoIndex,
                            1
                        );

                        salvarImoveis();

                        exibirImoveis();
                    }
                }
            );

            item.appendChild(imagem);
            item.appendChild(botaoExcluir);

            galeria.appendChild(item);
        });

        card.appendChild(galeria);
    }

    // ENDEREÇO
    const endereco =
        document.createElement("p");

    endereco.innerHTML =
        "<strong>Endereço:</strong> " +
        escaparHTML(imovel.endereco || "");

    card.appendChild(endereco);

    // PREÇO
    const preco =
        document.createElement("p");

    const valor =
        Number(imovel.preco);

    preco.innerHTML =
        "<strong>Preço:</strong> R$ " +
        (
            isNaN(valor)
                ? "0,00"
                : valor.toLocaleString(
                    "pt-BR",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )
        );

    card.appendChild(preco);

    // INFORMAÇÕES
    const info =
        document.createElement("div");

    info.className =
        "info-imovel";

    if (
        imovel.quartos !== undefined &&
        imovel.quartos !== ""
    ) {

        const item =
            document.createElement("span");

        item.className =
            "info-item";

        item.textContent =
            "🛏️ " +
            imovel.quartos +
            " quarto(s)";

        info.appendChild(item);
    }

    if (
        imovel.banheiros !== undefined &&
        imovel.banheiros !== ""
    ) {

        const item =
            document.createElement("span");

        item.className =
            "info-item";

        item.textContent =
            "🚿 " +
            imovel.banheiros +
            " banheiro(s)";

        info.appendChild(item);
    }

    if (
        imovel.vagas !== undefined &&
        imovel.vagas !== ""
    ) {

        const item =
            document.createElement("span");

        item.className =
            "info-item";

        item.textContent =
            "🚗 " +
            imovel.vagas +
            " vaga(s)";

        info.appendChild(item);
    }

    if (
        imovel.area !== undefined &&
        imovel.area !== ""
    ) {

        const item =
            document.createElement("span");

        item.className =
            "info-item";

        item.textContent =
            "📐 " +
            imovel.area +
            " m²";

        info.appendChild(item);
    }

    if (info.children.length > 0) {
        card.appendChild(info);
    }

    // DESCRIÇÃO
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

        descricao.appendChild(tituloDescricao);
        descricao.appendChild(textoDescricao);

        card.appendChild(descricao);
    }

    // BOTÕES
    const botoes =
        document.createElement("div");

    botoes.className =
        "botoes";

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

    botoes.appendChild(botaoEditar);
    botoes.appendChild(botaoExcluir);

    card.appendChild(botoes);

    listaImoveis.appendChild(card);
});
```

}

// CADASTRAR / ATUALIZAR
form.addEventListener(
"submit",
async function(event) {

```
    event.preventDefault();

    const tipo =
        document.getElementById("tipo").value;

    const endereco =
        document.getElementById("endereco").value.trim();

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
        document.getElementById("descricao").value.trim();

    if (!tipo || !endereco || !preco) {

        alert(
            "Preencha os campos obrigatórios."
        );

        return;
    }

    let fotos = [];

    if (indiceEdicao !== -1) {

        const existente =
            imoveis[indiceEdicao];

        if (
            existente &&
            Array.isArray(existente.fotos)
        ) {

            fotos = [
                ...existente.fotos
            ];
        }
    }

    if (fotosSelecionadas.length > 0) {

        fotos =
            fotos.concat(
                fotosSelecionadas
            );
    }

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

    if (indiceEdicao === -1) {

        imoveis.push(
            imovelAtualizado
        );

        if (!salvarImoveis()) {
            return;
        }

        alert(
            "Imóvel cadastrado com sucesso!"
        );

    } else {

        imoveis[indiceEdicao] =
            imovelAtualizado;

        if (!salvarImoveis()) {
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

    form.reset();

    fotosSelecionadas = [];

    previewFotos.innerHTML = "";

    exibirImoveis();
}
```

);

// EDITAR
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

// EXCLUIR IMÓVEL
function excluirImovel(index) {

```
if (
    !confirm(
        "Deseja realmente excluir este imóvel?"
    )
) {
    return;
}

imoveis.splice(index, 1);

salvarImoveis();

exibirImoveis();

alert(
    "Imóvel excluído com sucesso!"
);
```

}

// ABRIR FOTO
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

// FECHAR FOTO
function fecharFoto() {

```
modalFoto.classList.remove(
    "ativo"
);

fotoAmpliada.src = "";
```

}

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

modalFoto.addEventListener(
"click",
function(event) {

```
    if (event.target === modalFoto) {
        fecharFoto();
    }
}
```

);

document.addEventListener(
"keydown",
function(event) {

```
    if (
        event.key === "Escape" &&
        modalFoto.classList.contains("ativo")
    ) {
        fecharFoto();
    }
}
```

);

fotoAmpliada.addEventListener(
"error",
function() {
fecharFoto();
}
);

pesquisa.addEventListener(
"input",
function() {
exibirImoveis();
}
);

filtroTipo.addEventListener(
"change",
function() {
exibirImoveis();
}
);

function escaparHTML(texto) {

```
const div =
    document.createElement("div");

div.textContent =
    texto;

return div.innerHTML;
```

}

// INICIAR
exibirImoveis();
