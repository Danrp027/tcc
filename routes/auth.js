const express = require('express');
const router = express.Router();
const db = require('../models/db');
const path = require('path');
const bcrypt = require('bcrypt');

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
router.post("/", async (req, res) => {
  const { cpf, email, senha } = req.body;

  if (!cpf || !email || !senha) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = `
      INSERT INTO usuarios (cpf, email, senha)
      VALUES (?, ?, ?)
    `;

    db.run(query, [cpf, email, senhaCriptografada], (err) => {
      if (err) {
        console.error("Erro ao inserir Usuario:", err);
        return res
          .status(500)
          .send("Erro ao inserir o usuário. Verifique os dados e tente novamente.");
      }

      res.send("Usuário inserido com sucesso!");
    });
  } catch (error) {
    console.error("Erro ao criptografar a senha:", error);
    res.status(500).send("Erro interno ao processar o cadastro.");
  }
});

// Login
router.post("/login", (req, res) => {
  const { valor, senha } = req.body;

  if (!valor || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  const query = `SELECT * FROM usuarios WHERE email = ? OR cpf = ?`;

  db.get(query, [valor, valor], async (err, row) => {
    if (err) {
      console.error("Erro no login:", err);
      return res.status(500).json({ error: "Erro no servidor. Tente novamente." });
    }

    if (!row) {
      return res.status(401).json({ error: "Email ou CPF incorreto(s)." });
    }

    const senhaCorreta = await bcrypt.compare(senha, row.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    
    return res.json({ redirect: "/projetos.html" });
  });
});

module.exports = router;

