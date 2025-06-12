const express = require('express');
const router = express.Router();
const db = require('../models/db');
const path = require('path');

// Listar usuarios
router.get("/", (req, res) => {
  const query = "SELECT * FROM usuarios";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar cliente:", err);
      return res.status(500).send("Erro ao buscar cliente.");
    }

    res.json(rows); 
  });
});


//Adicionar Usuario
router.post("/", (req, res) => {
  const { cpf, email, senha } = req.body;

  const query = `
    INSERT INTO usuarios (cpf, email, senha)
    VALUES (?, ?, ?)
  `;

  db.run(
    query,
    [cpf, email, senha],
    (err) => {
      if (err) {
        console.error("Erro ao inserir Usuario:", err);
        return res
          .status(500)
          .send("Ocorreu um erro ao tentar inserir o usuario. Verifique os dados e tente novamente.");
      }
      res.send("usuario inserido com sucesso!");
    }
  );
});

// Login
router.post("/login", (req, res) => {
  const { email, senha } = req.body;


  if (!email || !senha) {
    return res.status(400).send("Preencha o email e a senha.");
  }

  const query = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`;

  db.get(query, [email, senha], (err, row) => {
    if (err) {
      console.error("Erro ao realizar login:", err);
      return res.status(500).send("Erro no servidor. Tente novamente mais tarde.");
    }

    if (!row) {
      return res.status(401).send("Email ou senha incorretos.");
    }

     res.send('paginainicial.html');
  });
});


router.get('/', (req, res) => {
    res.send("Rota Funcionando!")
});

module.exports = router;

