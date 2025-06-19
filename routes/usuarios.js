const express = require('express');
const router = express.Router();
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');


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

router.post("/criarUsuario", async (req, res) => {
  const { nomeCompleto, cpf, email, senha } = req.body;
  const senhaCriptografada = await bcrypt.hash(senha, 10);




  const query = `
    INSERT INTO usuarios (nome, cpf, email, senha)
    VALUES (?, ?, ?, ?);
  `;



  db.run(
    query,
    [nomeCompleto, cpf, email, senhaCriptografada],
    (err) => {
      if (err) {
        console.error("Erro ao inserir Usuario:", err);
        return res
          .status(500)
          .send("Ocorreu um erro ao tentar inserir o usuario. Verifique os dados e tente novamente.");
      }
      res.send("Usuario inserido com sucesso!");
    }
  );
});

router.patch("/usuarios/:id", upload.single("foto"), (req, res) => {
  const id = req.params.id;

  const {
    nome,
    email,
    idade,
    modulo,
    turma,
    curso,
    biografia,
    hardskills,
    softskills,
    portfolio
  } = req.body;

  const foto = req.file ? "uploads/" + req.file.filename : null;

  const query = `
    UPDATE usuarios SET 
      nome = ?, 
      email = ?, 
      idade = ?, 
      modulo = ?, 
      turma = ?, 
      curso = ?, 
      biografia = ?, 
      hardskills = ?, 
      softskills = ?, 
      portfolio = ?
      ${foto ? ", foto = ?" : ""}
    WHERE id = ?
  `;

  const params = foto
    ? [nome, email, idade, modulo, turma, curso, biografia, hardskills, softskills, portfolio, foto, id]
    : [nome, email, idade, modulo, turma, curso, biografia, hardskills, softskills, portfolio, id];

  db.run(query, params, (err) => {
    if (err) {
      console.error("Erro ao atualizar perfil:", err);
      return res.status(500).json({ error: "Erro ao atualizar perfil." });
    }

    res.json({ message: "Perfil atualizado com sucesso!" });
  });
});


router.get('/', (req, res) => {
  res.send("Rota Funcionando!")
});




module.exports = router;