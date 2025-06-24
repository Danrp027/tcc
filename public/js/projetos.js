
        function cadastrarProjeto(event) {
            event.preventDefault();

            const nomeProjeto = document.getElementById('nome').value.trim();
            const descricao = document.getElementById('descricao').value.trim();
            const objetivo = document.getElementById('objetivo').value.trim();
            const cursoRelacionado = document.getElementById("cursoRelacionado").value;
            const responsavel_id = localStorage.getItem("usuario_id");
            const status = document.getElementById('status').value;
            const dataInicio = document.getElementById('dataInicio').value;
            const dataFim = document.getElementById('dataFim').value;

            const vagas = [
                { curso: "Mecânica", total: parseInt(document.getElementById("vagasMecanica").value || 0) },
                { curso: "Elétrica", total: parseInt(document.getElementById("vagasEletrica").value || 0) },
                { curso: "Desenvolvimento de Sistemas", total: parseInt(document.getElementById("vagasDev").value || 0) }
            ].filter(v => v.total > 0);

            if (!nomeProjeto || !descricao || !objetivo || !cursoRelacionado || !status || !dataInicio || !dataFim) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }

            const info = { nomeProjeto, descricao, objetivo, cursoRelacionado, responsavel_id, status, dataInicio, dataFim, vagas };

            fetch('/api/projetos/criarProjeto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(info)
            })
                .then(response => response.text())
                .then(resposta => alert(resposta))
                .catch(error => {
                    console.error('Erro ao enviar as informações:', error);
                    alert('Ocorreu um erro ao enviar. Verifique sua conexão e tente novamente.');
                });
        }