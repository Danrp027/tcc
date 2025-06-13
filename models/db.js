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

  }
});


function criarTabelas() {

  //Usuarios
  db.run(`
 CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
	nome TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
	idade	INTEGER,
	id_curso INTEGER NOT NULL,
  FOREIGN KEY(id_curso) REFERENCES cursos(id),
	turma	TEXT,
  modulo TEXT,
	foto	TEXT,
	biografia	TEXT,
	hardskills	TEXT,
	softskills	TEXT,
  portfolio	TEXT
	
);

  `);



  // Projetos
  db.run(`
  CREATE TABLE projetos (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nome	TEXT NOT NULL,
	descricao	TEXT,
	objetivo	TEXT,
	curso_relacionado	TEXT,
	responsavel_id	INTEGER,
	status	TEXT,
	data_inicio	DATE,
	data_fim	DATE,
	FOREIGN KEY(responsavel_id) REFERENCES "usuarios"(id)
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

