const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, '../database/banco.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
  } else {
    console.log('Banco conectado com sucesso!');
    //criarTabelas();
    //deletarTabela();
  }
});


function criarTabelas() {

  //Alunos
  db.run(`
 CREATE TABLE alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    idade INTEGER,
    curso TEXT NOT NULL,
    turma TEXT,
    email TEXT UNIQUE NOT NULL,
    foto TEXT,
    bio TEXT,
    github TEXT,
    linkedin TEXT,
    portfolio TEXT
);

  `);


  // Habilidades Tecnicas
  db.run(`
 CREATE TABLE habilidades_tecnicas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INTEGER,
    habilidade TEXT,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);


    )
  `);

  // Soft Skills
  db.run(`
   CREATE TABLE soft_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INTEGER,
    skill TEXT,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

  `);

  // Projetos
  db.run(`
    CREATE TABLE projetos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    area_tecnica TEXT,
    objetivo TEXT,
    curso_relacionado TEXT,
    responsavel_id INTEGER, -- Aluno ou professor
    status TEXT CHECK(status IN ('Em andamento', 'Concluído', 'Aguardando participantes', 'Cancelado')),
    data_inicio DATE,
    data_fim DATE,
    FOREIGN KEY (responsavel_id) REFERENCES alunos(id)
);

  `);

  // Participações Ligações Alunos e Projetos
  db.run(`
 CREATE TABLE participacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INTEGER,
    projeto_id INTEGER,
    funcao TEXT, -- exemplo: líder, desenvolvedor, etc.
    aprovado BOOLEAN DEFAULT 0,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (projeto_id) REFERENCES projetos(id)
);

  `);

  // Documentos dos Projetos
  db.run(`
   CREATE TABLE documentos_projetos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projeto_id INTEGER,
    nome_arquivo TEXT,
    caminho_arquivo TEXT,
    data_upload DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (projeto_id) REFERENCES projetos(id)
);

  `);

  db.run(`
   CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpf TEXT,
    email TEXT,
    senha TEXT
  );
    
  `);





}

module.exports = db;

