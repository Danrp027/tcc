const express = require('express');
const router = express.Router();
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require("fs");

// Configuração do upload da foto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/image'));
  },
  filename: (req, file, cb) => {
    const nomeArquivo = Date.now() + path.extname(file.originalname);
    cb(null, nomeArquivo);
  }
});
const upload = multer({ storage });

// Criar novo usuário
router.post("/criarUsuario", async (req, res) => {
  const { nomeCompleto, cpf, email, senha } = req.body;
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const query = `
    INSERT INTO usuarios (nome, cpf, email, senha)
    VALUES (?, ?, ?, ?);
  `;

  db.run(query, [nomeCompleto, cpf, email, senhaCriptografada], (err) => {
    if (err) {
      console.error("Erro ao inserir Usuario:", err);
      return res.status(500).send("Erro ao inserir o usuário.");
    }
    res.send("Usuário inserido com sucesso!");
  });
});


// Atualizar dados pessoais
router.patch("/usuarios/:id", upload.single("foto"), (req, res) => {
  const id = req.params.id;
  const { nome, email, idade, turma, modulo, biografia, portfolio } = req.body;
  const foto = req.file ? req.file.filename : null;

  const campos = [];
  const valores = [];

  if (nome) campos.push("nome = ?"), valores.push(nome);
  if (email) campos.push("email = ?"), valores.push(email);
  if (idade) campos.push("idade = ?"), valores.push(idade);
  if (turma) campos.push("turma = ?"), valores.push(turma);
  if (modulo) campos.push("modulo = ?"), valores.push(modulo);
  if (biografia) campos.push("biografia = ?"), valores.push(biografia);
  if (portfolio) campos.push("portfolio = ?"), valores.push(portfolio);
  if (foto) campos.push("foto = ?"), valores.push(foto);

  if (campos.length === 0) return res.status(400).json({ error: "Nenhum campo enviado para atualização." });

  const query = `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`;
  valores.push(id);

  db.run(query, valores, (err) => {
    if (err) {
      console.error("Erro ao atualizar usuário:", err);
      return res.status(500).json({ error: "Erro ao atualizar perfil." });
    }
    res.json({ message: "Perfil atualizado com sucesso!" });
  });
});


// Atualizar skills separadamente
router.post("/usuarios/:id/skills", async (req, res) => {
  const { id } = req.params;
  const { hardskills, softskills } = req.body;

  try {
    const hards = hardskills || [];
    const softs = softskills || [];

    // Limpar dados antigos
    await Promise.all([
      new Promise(resolve => db.run(`DELETE FROM usuario_hardskills WHERE usuario_id = ?`, [id], resolve)),
      new Promise(resolve => db.run(`DELETE FROM usuario_softskills WHERE usuario_id = ?`, [id], resolve))
    ]);

    // Inserir hard skills
    await Promise.all(hards.map(hab =>
      new Promise(resolve => {
        db.get(`SELECT id FROM hardskills WHERE habilidade = ?`, [hab], (err, row) => {
          if (row) {
            db.run(`INSERT INTO usuario_hardskills (usuario_id, hardskill_id) VALUES (?, ?)`, [id, row.id], resolve);
          } else {
            db.run(`INSERT INTO hardskills (habilidade) VALUES (?)`, [hab], function () {
              db.run(`INSERT INTO usuario_hardskills (usuario_id, hardskill_id) VALUES (?, ?)`, [id, this.lastID], resolve);
            });
          }
        });
      })
    ));

    // Inserir soft skills
    await Promise.all(softs.map(skill =>
      new Promise(resolve => {
        db.get(`SELECT id FROM softskills WHERE skill = ?`, [skill], (err, row) => {
          if (row) {
            db.run(`INSERT INTO usuario_softskills (usuario_id, softskill_id) VALUES (?, ?)`, [id, row.id], resolve);
          } else {
            db.run(`INSERT INTO softskills (skill) VALUES (?)`, [skill], function () {
              db.run(`INSERT INTO usuario_softskills (usuario_id, softskill_id) VALUES (?, ?)`, [id, this.lastID], resolve);
            });
          }
        });
      })
    ));

    res.json({ message: "Skills atualizadas com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar skills:", err);
    res.status(500).json({ error: "Erro ao atualizar skills." });
  }
});


// Buscar dados do usuário + relacionamentos
router.get("/usuarios/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM usuarios WHERE id = ?", [id], (err, usuario) => {
    if (err || !usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const queryCursos = `
      SELECT c.curso FROM usuario_cursos uc
      JOIN cursos c ON uc.curso_id = c.id
      WHERE uc.usuario_id = ?
    `;
    const queryHardskills = `
      SELECT h.habilidade FROM usuario_hardskills uh
      JOIN hardskills h ON uh.hardskill_id = h.id
      WHERE uh.usuario_id = ?
    `;
    const querySoftskills = `
      SELECT s.skill FROM usuario_softskills us
      JOIN softskills s ON us.softskill_id = s.id
      WHERE us.usuario_id = ?
    `;

    db.all(queryCursos, [id], (err, cursos) => {
      db.all(queryHardskills, [id], (err, hardskills) => {
        db.all(querySoftskills, [id], (err, softskills) => {
          res.json({
            ...usuario,
            cursos: cursos.map(c => c.curso),
            hardskills: hardskills.map(h => h.habilidade),
            softskills: softskills.map(s => s.skill)
          });
        });
      });
    });
  });
});


// Listar cursos
router.get("/cursos", (req, res) => {
  db.all("SELECT curso FROM cursos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar cursos" });
    res.json(rows);
  });
});

// Listar hard skills
router.get("/hardskills", (req, res) => {
  db.all("SELECT habilidade FROM hardskills", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar hard skills" });
    res.json(rows);
  });
});

// Listar soft skills
router.get("/softskills", (req, res) => {
  db.all("SELECT skill FROM softskills", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar soft skills" });
    res.json(rows);
  });
});

module.exports = router;
