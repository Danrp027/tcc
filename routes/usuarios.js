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


router.get('/', (req, res) => {
  const query = "SELECT * FROM alunos";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar alunos:", err);
      return res.status(500).send("Erro ao buscar alunos.");
    }

    res.json(rows);
  });
});

router.post("/criarUsuario", async (req, res) => {
  const { nomeCompleto, cpf, email, senha, idade, turma, modulo } = req.body;
  const senhaCriptografada = await bcrypt.hash(senha, 10);




  const query = `
    INSERT INTO usuarios (nome, cpf, email, senha, idade, turma, modulo)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;



  db.run(
    query,
    [nomeCompleto, cpf, email, senhaCriptografada, idade, turma, modulo],
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


router.put("/:id", upload.single("foto"), (req, res) => {
  const { nomeCompleto, cpf, email, idade, curso, turma, modulo, biografia, hardskills, softskills, portifolio } = req.body;
  const id = req.params.id;
  const fotoPerfil = req.file ? "image/" + req.file.filename : null;

  const query = `
    UPDATE usuarios SET 
      nome = ?, 
      cpf = ?, 
      email = ?, 
      senha = ?, 
      idade = ?, 
      turma = ?, 
      modulo = ?, 
      ${fotoPerfil ? "foto = ?," : ""}
      biografia = ?, 
      portfolio = ?
    WHERE id = ?
  `;

  const params = imagem
    ? [nome, categoria, unidade, custo, venda, validade, imagem, minimo, quantidade, id]
    : [nome, categoria, unidade, custo, venda, validade, minimo, quantidade, id];

  db.run(query, params, (err) => {
    if (err) {
      console.error("Erro ao atualizar produto:", err);
      return res.status(500).send("Erro ao atualizar produto.");
    }
    res.send("Produto atualizado com sucesso!");
  });
});


router.get('/', (req, res) => {
  res.send("Rota Funcionando!")
});




module.exports = router;