const express = require('express');
const router = express.Router();
const db = require('../models/db');
const multer = require('multer');
const path = require('path');


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

router.post("/", upload.single('imagem'), (req, res) => {
  const { nomeCompleto, idade, curso, turma, email, bio, habilidadesTecnicas, softSkills, gitHub, portifolio } = req.body;
  const { id } = req.params;

  const fotoPerfil = req.file ? 'image/' + req.file.filename : null;

  const query = `
    INSERT INTO alunos (nome, idade, turma, email, foto, bio, github, linkedin, portifolio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

    INSERT INTO habilidades_tecnicas ()
    VALUES ();

    
    INSERT INTO soft_skills ()
    VALUES ();
  `;

  

  db.run(
    query,
    [nomeCompleto, idade, turma, email, fotoPerfil, bio, gitHub, linkedin, portifolio],
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