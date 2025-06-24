const express = require('express');
const router = express.Router();
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require("fs");


//lista de projetos

router.get('/listar', (req, res) => {
  const sql = `
    SELECT 
      p.id, p.nome, p.descricao, p.objetivo, p.curso_relacionado,
      p.status, p.data_inicio, p.data_fim, u.nome AS responsavel
    FROM projetos p
    LEFT JOIN usuarios u ON u.id = p.responsavel_id
  `;

  db.all(sql, [], (err, projetos) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar projetos' });
    res.json(projetos);
  });
});

// Criar novo usuário
router.post("/criarProjeto", (req, res) => {
  const { nomeProjeto, descricao, objetivo, cursoRelacionado, responsavel_id, status, dataInicio, dataFim } = req.body;
  


  const query = `
    INSERT INTO projetos (nome, descricao, objetivo, curso_relacionado, responsavel_id, status, data_inicio, data_fim)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;

  db.run(query, [nomeProjeto, descricao, objetivo, cursoRelacionado, responsavel_id, status, dataInicio, dataFim], (err) => {
    if (err) {
      console.error("Erro ao inserir Projeto:", err);
      return res.status(500).send("Erro ao inserir o Projeto.");
    }
    res.send("Projeto registrado com sucesso!");
  });
});

router.get('/listarComVagas', (req, res) => {
  const sqlProjetos = `
    SELECT p.id, p.nome, p.descricao, p.objetivo, p.curso_relacionado,
           p.status, p.data_inicio, p.data_fim, u.nome AS responsavel
    FROM projetos p
    LEFT JOIN usuarios u ON u.id = p.responsavel_id
  `;

  db.all(sqlProjetos, [], (err, projetos) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar projetos' });

    const sqlVagas = `
      SELECT v.projeto_id, v.curso, v.vagas_total, COUNT(p.id) AS ocupadas
      FROM vagas_projetos v
      LEFT JOIN participacoes p ON p.projeto_id = v.projeto_id AND p.funcao = v.curso AND p.aprovado = 1
      GROUP BY v.projeto_id, v.curso
    `;

    db.all(sqlVagas, [], (err, vagas) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar vagas' });

      // Organiza vagas por projeto
      const vagasPorProjeto = {};
      vagas.forEach(v => {
        if (!vagasPorProjeto[v.projeto_id]) vagasPorProjeto[v.projeto_id] = [];
        vagasPorProjeto[v.projeto_id].push({
          curso: v.curso,
          total: v.vagas_total,
          ocupadas: v.ocupadas
        });
      });

      // Anexa as vagas aos projetos
      const resultado = projetos.map(p => ({
        ...p,
        vagas: vagasPorProjeto[p.id] || []
      }));

      res.json(resultado);
    });
  });
});


module.exports = router;