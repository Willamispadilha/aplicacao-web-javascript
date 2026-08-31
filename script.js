const form = document.getElementById("formImovel");

const listaImoveis = document.getElementById("listaImoveis");

const pesquisa = document.getElementById("pesquisa");

const filtroTipo = document.getElementById("filtroTipo");


// Recupera os imóveis já salvos
let imoveis = JSON.parse(localStorage.getItem("imoveis")) || [];


// Controla se estamos editando algum imóvel
let indiceEdicao = -1;


// =====================================================
// SALVAR IMÓVEIS
// =====================================================

function salvarImoveis() {

    localStorage.setItem(
        "imoveis",
        JSON.stringify(imoveis)
    );

}


// =====================================================
// EXIBIR IMÓVEIS
// =====================================================

function exibirImoveis() {

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

}


// =====================================================
// CADASTRAR / ATUALIZAR IMÓVEL
// =====================================================

form.addEventListener(
    "submit",
    function(event) {

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


        // Novos campos
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


        // Objeto do imóvel
        const imovelAtualizado = {

            tipo: tipo,

            endereco: endereco,

            preco: preco,

            quartos: quartos,

            banheiros: banheiros,

            vagas: vagas,

            area: area,

            descricao: descricao

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


        // Atualizar lista
        exibirImoveis();

    }
);


// =====================================================
// EDITAR IMÓVEL
// =====================================================

function editarImovel(index) {

    const imovel =
        imoveis[index];


    // Campos antigos
    document.getElementById("tipo").value =
        imovel.tipo || "";


    document.getElementById("endereco").value =
        imovel.endereco || "";


    document.getElementById("preco").value =
        imovel.preco || "";


    // Novos campos
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

}


// =====================================================
// EXCLUIR IMÓVEL
// =====================================================

function excluirImovel(index) {

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

}


// =====================================================
// PESQUISA
// =====================================================

pesquisa.addEventListener(
    "input",
    function() {

        exibirImoveis();

    }
);


// =====================================================
// FILTRO POR TIPO
// =====================================================

filtroTipo.addEventListener(
    "change",
    function() {

        exibirImoveis();

    }
);


// =====================================================
// PROTEÇÃO CONTRA HTML INDESEJADO
// =====================================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto;

    return div.innerHTML;

}


// =====================================================
// INICIAR
// =====================================================

exibirImoveis();
