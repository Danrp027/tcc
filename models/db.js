const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, '../database/senai.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
  } else {
    console.log('Banco conectado com sucesso!');
    criarTabelas();
    //deletarColuna();
    //deletarLinha();



  }
});

function deletarColuna() {

  db.run(`
ALTER TABLE usuarios DROP COLUMN softskills;
  `);

}


function deletarLinha() {

  db.run(`
DELETE FROM usuarios WHERE id = 1;
  `);

}





function criarTabelas() {

  //Usuarios
  db.run(`
 CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
	nome TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
	idade	INTEGER,
  curso TEXT,
	turma	TEXT,
  modulo TEXT,
	foto	TEXT,
	biografia	TEXT,
	hardskills	TEXT,
	softskills	TEXT,
  portfolio	TEXT
	
);

  `);

  // Habilidades Tecnicas
  db.run(`
 CREATE TABLE IF NOT EXISTS hardskills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INTEGER,
    habilidade TEXT,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);


    )
  `);

  // Soft Skills
  db.run(`
   CREATE TABLE IF NOT EXISTS softskills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INTEGER,
    skill TEXT,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

  `);

  //Cursos
  db.run(`
   CREATE TABLE IF NOT EXISTS cursos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INTEGER,
    curso TEXT,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

  `);

  // Projetos
  db.run(`
  CREATE TABLE IF NOT EXISTS projetos (
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
 CREATE TABLE IF NOT EXISTS participacoes (
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
   CREATE TABLE IF NOT EXISTS documentos_projetos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projeto_id INTEGER,
    nome_arquivo TEXT,
    caminho_arquivo TEXT,
    data_upload DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (projeto_id) REFERENCES projetos(id)
);

  `);


}

module.exports = db;

