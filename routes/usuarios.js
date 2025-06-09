const express = require('express');
const router = express.Router();
const db = require('../models/db');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/imagens'));
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

router.post("/", upload.single('imagem'), (req, res) => {
  const { nomeCompleto, curso, turma, email, foto, bio, habilidadesTecnicas, softSkills, gitHub, linkedin } = req.body;

  const imagem = req.file ? 'imagens/' + req.file.filename : null;

  const query = `
    INSERT INTO alunos (nome, curso, turma, email, foto, bio, github, estoque_minimo, quantidade)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [nome, categoria, unidade, custo, venda, validade, imagem, minimo, quantidade],
    (err) => {
      if (err) {
        console.error("Erro ao inserir produto:", err);
        return res
          .status(500)
          .send("Ocorreu um erro ao tentar inserir o produto. Verifique os dados e tente novamente.");
      }
      res.send("Produto inserido com sucesso!");
    }
  );
});

router.get('/', (req, res) => {
    res.send("Rota Funcionando!")
});




module.exports = router;