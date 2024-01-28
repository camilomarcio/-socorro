const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { OpenAI } = require("openai");
require("dotenv").config();
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/", (req, res) => {
  res.render("chat");
});


app.get("/chat", (req, res) => {
  res.render("chat");
});





io.on("connection", (socket) => {
  console.log("Novo usuário conectado");

  socket.on("chat message", async (msg) => {
    try {
      const resposta = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              'Aqui estão algumas orientações: você é um assistente médico virtual dedicado a fornecer diretrizes em situações de acidentes de maneira rápida e concisa, apresentando uma sequência de passos. Por favor, forneça os passos enumerando cada um. Inicie sempre a sua resposta com: "Aqui estão algumas orientações"',
          },
          { role: "user", content: msg },
        ],
      });
      io.emit("chat message", resposta.choices[0].message.content);
    } catch (error) {
      console.error("Erro ao fazer chamada à API do OpenAI:", error);
      io.emit("chat message", "Erro ao processar a pergunta");
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado");
  });
});


app.post("/resposta", async (req, res) => {
  try {
    const perguntar = req.body.texto_pergunta;

    const resposta = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            'Aqui estão algumas orientações: você é um assistente médico virtual dedicado a fornecer diretrizes em situações de acidentes de maneira rápida e concisa, apresentando uma sequência de passos. Por favor, forneça os passos enumerando cada um. Inicie sempre a sua resposta com: "Aqui estão algumas orientações"',
        },
        { role: "user", content: perguntar },
      ],
    });

    res.send(resposta.choices[0].message.content);
  } catch (error) {
    console.error("Erro ao fazer chamada à API do OpenAI:", error);
    res.status(500).send("Erro ao processar a pergunta");
  }
});


// CONEXÃO DO BANCO DE DADOS
const connection1 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'senac123456789',
  database: 'socorro'
});
// TESTE DE CONEXÃO (DIGITE NO TERMINAL 'NODE "NOME DO ARQUIVO".JS)
connection1.connect((err) => {
  if (err) {
    console.error('Erro ao conectar: ', err);
    return;
  }
  console.log('Banco de dados conectado com sucesso');
});
//ROTAS DE CONEXÃO
app.get('/criar', (req, res) => {
  res.render('cadastro');
});

//ROTA DE CONEXÃO PARA CADASTRO
app.post('/criar-ficha', (req, res) => {
  const {nome,cpf,email,data_nascimento,telefone_principal,telefone_responsavel,alergias,comorbidade,tipo_sanguineo,cartao_sus} = req.body;
  console.log (req.body)
  const query = 'INSERT INTO fichario (nome,cpf,email,data_nascimento,telefone_principal,telefone_responsavel,alergias,comorbidade,tipo_sanguineo,cartao_sus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,)';
  connection.query(query, [nome,cpf,email,data_nascimento,telefone_principal,telefone_responsavel,alergias,comorbidade,tipo_sanguineo,cartao_sus], (error, results) => {
    if (error) {
      console.error('Erro ao criar cliente: ', error);
      res.status(500).send('Erro ao criar cliente');
      return;
    }
    res.redirect('/ficha');
  });

});

//ROTA DE CONEXÃO DA FICHA
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



server.listen(3001, () => {
  console.log(`Servidor rodando`);
});