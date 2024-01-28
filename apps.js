//CONEXÃO BANCO DE DADOS!!!!!!!!!

const express = require('express');
//const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const server = http.createServer(app);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'senac123456789',
  database: 'ficha_de_saude'
});
// TESTE DE CONEXÃO (DIGITE NO TERMINAL 'NODE "NOME DO ARQUIVO".JS)
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar: ', err);
    return;
  }
  console.log('Banco de dados conectado com sucesso');
});

// CRIAR A FICHA
app.get('/criar', (req, res) => {
  res.render('cadastro');
});

app.post('/criar_ficha', (req, res) => {
  const { nome, idade, cpf, cart_sus, comorbidade, alergias, N_responsavel, email } = req.body;
  const query = 'INSERT INTO ficha (nome, idade, cpf, cart_sus, comorbidade, alergias, N_responsavel, email) VALUES (?, ?, SHA1(?), SHA1(?), ?, ?, SHA1(?), ?)';
  connection.query(query, [nome, idade, cpf, cart_sus, comorbidade, alergias, N_responsavel, email], (error, results) => {
    if (error) {
      console.error('Erro ao criar cliente: ', error);
      res.status(500).send('Erro ao criar cliente');
      return;
    }
    res.redirect('index');
  });
});

// CADASTRO PARA LOGIN
app.get('/cadastr', (req, res) => {
  res.render('cadastro');
});

app.post('/criar-cadastro', (req, res) => {
  const { nome_usuario, email_usuario } = req.body;
  const query = 'INSERT INTO usuario (nome_usuario, email_usuario) VALUES (?, ? )';
  connection.query(query, [nome_usuario, email_usuario], (error, results) => {
    if (error) {
      console.error('Erro ao criar usuario: ', error);
      res.status(500).send('Erro ao criar usuario');
      return;
    }
    res.redirect('/login');
  });
});

// MOSTRAR A FICHA
app.get('/ficha', (req, res) => {
  const query = 'SELECT nome,cpf,email,data_nascimento,telefone_principal,telefone_responsavel,alergias,comorbidade,tipo_sanguineo,cartao_sus FROM fichario INNER JOIN login on id=idlogin WHERE email=email_login ';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao buscar FICHA: ', error);
      res.status(500).send('Erro ao buscar FICHA');
      return;
    }
       res.render('/ficha', { users: results });
  });
});
// PORTA PARA VER O SITE (LOCALHOST:3000/)
server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});