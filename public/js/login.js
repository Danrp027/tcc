function Logar() {
  const valor = document.getElementById('valor').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!valor || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  const info = { valor, senha };

  fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(info)
  })
    .then(res => res.json())
    .then(data => {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else if (data.error) {
        alert(data.error);
      }
    })
    .catch(error => {
      console.error('Erro ao logar:', error);
      alert("Erro ao tentar login. Verifique sua conexão.");
    });
}
