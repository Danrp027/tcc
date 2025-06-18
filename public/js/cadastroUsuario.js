function cadastrarUsuario() {

    const nomeCompleto = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const idade = document.getElementById('idade').value.trim();
    const turma = document.getElementById('turma').value.trim();
    const modulo = document.getElementById('modulo').value.trim();




    if (!nomeCompleto || !cpf || !email || !senha || !idade || !turma || !modulo) {
        alert("Preencha todos os campos obrigatórios.");
        return;

    }

    const info = { nomeCompleto, cpf, email, senha, idade, turma, modulo };

    fetch('/api/usuarios/criarUsuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
    })
        .then(response => response.text())
        .then(resposta => alert(resposta))
        .catch(error => {
            console.error('Erro ao enviar as informações:', error);
            alert('Ocorreu um erro ao enviar os dados. Verifique sua conexão e tente novamente.');
        });
}
