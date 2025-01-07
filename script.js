// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_DOMINIO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_BUCKET.appspot.com",
    messagingSenderId: "SEU_MESSAGING_ID",
    appId: "SEU_APP_ID"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Elementos DOM
const editarBtn = document.getElementById('editar-produtos');
const salvarBtn = document.getElementById('salvar-produtos');
const produtos = document.querySelectorAll('.produto');

// Carregar Produtos do Firebase
window.addEventListener('load', () => {
    produtos.forEach(produto => {
        const produtoId = produto.dataset.id;
        db.collection('produtos').doc(produtoId).get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                produto.querySelector('h2').innerText = data.nome;
                produto.querySelector('p').innerText = data.descricao;
                produto.querySelector('.preco').innerText = data.preco;
                produto.querySelector('img').src = data.imgSrc;
            }
        });
    });
});

// Permitir Edição
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

        if (imgInput.files[0]) {
            const imgFile = imgInput.files[0];
            const storageRef = storage.ref(`produtos/${produtoId}.jpg`);

            storageRef.put(imgFile).then(snapshot => {
                snapshot.ref.getDownloadURL().then(imgSrc => {
                    salvarNoFirestore(produtoId, nome, descricao, preco, imgSrc);
                });
            });
        } else {
            salvarNoFirestore(produtoId, nome, descricao, preco, imgTag.src);
        }
    });

    salvarBtn.classList.add('oculto');
});

// Salvar no Firestore
function salvarNoFirestore(id, nome, descricao, preco, imgSrc) {
    db.collection('produtos').doc(id).set({
        nome,
        descricao,
        preco,
        imgSrc
    }).then(() => {
        alert('✅ Alterações salvas com sucesso!');
    }).catch(error => {
        console.error('Erro ao salvar:', error);
    });
}
