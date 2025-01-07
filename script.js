const editarBtn = document.getElementById('editar-produtos');
const salvarBtn = document.getElementById('salvar-produtos');
const produtos = document.querySelectorAll('.produto');

// Carregar dados do LocalStorage ao iniciar
window.addEventListener('load', () => {
    produtos.forEach(produto => {
        const produtoId = produto.dataset.id;
        const dadosSalvos = JSON.parse(localStorage.getItem(produtoId));

        if (dadosSalvos) {
            produto.querySelector('h2').innerText = dadosSalvos.nome;
            produto.querySelector('p').innerText = dadosSalvos.descricao;
            produto.querySelector('.preco').innerText = dadosSalvos.preco;
            if (dadosSalvos.imgSrc) {
                produto.querySelector('img').src = dadosSalvos.imgSrc;
            }
        }
    });
});

// Permitir edição (protegido por senha)
editarBtn.addEventListener('click', () => {
    const senha = prompt('🔒 Digite a senha para editar:');
    if (senha === 'admin123') {
        produtos.forEach(produto => {
            produto.querySelector('h2').contentEditable = true;
            produto.querySelector('p').contentEditable = true;
            produto.querySelector('.preco').contentEditable = true;
            produto.querySelector('.input-imagem').classList.remove('oculto');
        });
        salvarBtn.classList.remove('oculto');
    } else {
        alert('❌ Senha incorreta!');
    }
});

// Salvar Alterações
salvarBtn.addEventListener('click', () => {
    produtos.forEach(produto => {
        const produtoId = produto.dataset.id;
        const imgInput = produto.querySelector('.input-imagem');
        const imgTag = produto.querySelector('img');
        const nome = produto.querySelector('h2').innerText;
        const descricao = produto.querySelector('p').innerText;
        const preco = produto.querySelector('.preco').innerText;

        // Verificar se uma nova imagem foi carregada
        if (imgInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgSrc = e.target.result; // Base64
                salvarProduto(produtoId, nome, descricao, preco, imgSrc);
            };
            reader.readAsDataURL(imgInput.files[0]);
        } else {
            salvarProduto(produtoId, nome, descricao, preco, imgTag.src);
        }
    });

    salvarBtn.classList.add('oculto');
});

// Função para salvar produto no localStorage
function salvarProduto(id, nome, descricao, preco, imgSrc) {
    localStorage.setItem(id, JSON.stringify({
        nome,
        descricao,
        preco,
        imgSrc
    }));
    alert('✅ Alterações salvas com sucesso!');
}
