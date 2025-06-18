// Obtem ID da URL (ex: editar.html?id=5)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
  fetch(`/api/produtos/${id}`)
    .then(res => res.json())
    .then(produto => {
      document.getElementById("id").value = produto.id;
      document.getElementById("nome").value = produto.nome;
      document.getElementById("categoria").value = produto.categoria;
      document.getElementById("unidade").value = produto.unidade;
      document.getElementById("custo").value = produto.preco_custo;
      document.getElementById("venda").value = produto.preco_venda;
      document.getElementById("quantidade").value = produto.quantidade;
      document.getElementById("minimo").value = produto.estoque_minimo;
      document.getElementById("validade").value = produto.validade?.slice(0, 10);
    });
}


    document.getElementById("form-editar-produto").addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append("nome", document.getElementById("nome").value);
      formData.append("categoria", document.getElementById("categoria").value);
      formData.append("unidade", document.getElementById("unidade").value);
      formData.append("custo", document.getElementById("custo").value);
      formData.append("venda", document.getElementById("venda").value);
      formData.append("quantidade", document.getElementById("quantidade").value);
      formData.append("minimo", document.getElementById("minimo").value);
      formData.append("validade", document.getElementById("validade").value);
      const imagem = document.getElementById("imagem").files[0];
      if (imagem) {
        formData.append("imagem", imagem);
      }

      fetch(`/api/produtos/${id}`, {
        method: "PUT",
        body: formData,
      })
        .then(res => res.text())
        .then(msg => {
          alert(msg);
          window.location.href = "lista.html"; 
        });
    });