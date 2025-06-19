document.addEventListener("DOMContentLoaded", () => {
  // Preencher campos com dados do localStorage
  const nome = localStorage.getItem("usuario_nome");
  const email = localStorage.getItem("usuario_email");
  const id = localStorage.getItem("usuario_id");

  const campoNome = document.querySelector('input[name="nome"]');
  const campoEmail = document.querySelector('input[name="email"]');

  if (campoNome && nome) campoNome.value = nome;
  if (campoEmail && email) campoEmail.value = email;

  // Enviar formulário de edição
  const form = document.getElementById("form-editar");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "PATCH",
        body: formData
      });

      const result = await response.json();

      if (result.message) {
        alert("Perfil atualizado com sucesso!");

        // Atualiza localStorage com os novos dados
        localStorage.setItem("usuario_nome", formData.get("nome"));
        localStorage.setItem("usuario_email", formData.get("email"));
      } else {
        alert(result.error || "Erro ao atualizar.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro de conexão.");
    }
  });
});
