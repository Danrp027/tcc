const express = require('express');
const app = express();
const path = require('path');
const db = require('./models/db'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const usuariosRoutes = require('./routes/usuarios');
const projetosRoutes = require('./routes/projetos');


app.use('/api/usuarios', usuariosRoutes);
app.use('/api/projetos', projetosRoutes);



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});