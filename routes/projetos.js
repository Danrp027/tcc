const express = require('express');
const router = express.Router();
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require("fs");

// Criar novo usuário
router.post("/criarProjeto", (req, res) => {
  const { nomeProjeto, descricao, objetivo, cursoRelacionado, status, dataInicio, dataFim } = req.body;
  const { id } = req.params;


  const query = `
    INSERT INTO projetos (nome, descricao, objetivo, curso_relacionado, responsavel_id, status, data_inicio, data_fim)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;

  db.run(query, [nomeProjeto, descricao, objetivo, cursoRelacionado, id, status, dataInicio, dataFim], (err) => {
    if (err) {
      console.error("Erro ao inserir Projeto:", err);
      return res.status(500).send("Erro ao inserir o Projeto.");
    }
    res.send("Projeto registrado com sucesso!");
  });
});

router.get('/', (req, res) => {
    res.send("Rota Funcionando!")
});

module.exports = router;