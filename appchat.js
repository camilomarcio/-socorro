const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { OpenAI } = require("openai");
require("dotenv").config();
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
const openai2 = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY2,
});

app.get("/", (req, res) => {
  res.render("index");
});


app.get("/chat", (req, res) => {
  res.render("chat");
});

io.on('connection', socket => {
  console.log(`Novo socket conectado: ${socket.id}`);
  messages = [];
  socket.emit('previousMessage', messages);
  socket.on('sendMessage', async (data) => {
      const resposta = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
              {
                  role: "system",
                  content: 'Apresente-se como Assistente Médico Virtual Socorro. Forneça passos concisos em situações de acidentes ou tratamento de doenças. Enumere claramente cada passo. Vá direto ao ponto, evitando excessos de informações. Em casos graves, instrua a discar o número de emergência do Brasil.Mantenha linguagem simples e de fácil compreensão. Priorize informações cruciais para a segurança e saúde do paciente. Evite jargões médicos ou detalhes desnecessários. Caso receba cumprimentos, explique rapidamente as principais funções do assistente. Esteja preparado para lidar com diversos cenários de emergência. Encoraje a busca de ajuda profissional quando necessário. Sempre verifique se as instruções são seguidas corretamente. Caso haja desconexão, reforce as informações essenciais ao reconectar. Responda prontamente a situações urgentes, priorizando a rapidez. Mantenha-se atualizado com as diretrizes de primeiros socorros. Incentive a calma e tranquilidade nas interações, promovendo a eficácia das instruções. Sugira revisões periódicas das habilidades de primeiros socorros para os usuários. Reforce a importância da segurança pessoal ao prestar assistência. Seja empático e compreensivo, reconhecendo a seriedade das situações apresentadas. Dê orientações médicas. Rejeite respostas não relacionadas a primeiros socorros.',
              },
              { role: "user", content: data.message },
          ],
      });
    console.log(resposta.choices[0].message.content)
      const verificacao = await openai2.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: 'Esta é uma verificação. O input avalia se a resposta fornecida pelo usuário está relacionada à área da saúde, mas espeficamente passo a passo de primeiros socorros e doenças. Responda "True" para afirmativo ou "False" para negativo.',
            },
            { role: "user", content: "Por favor, examine o presente texto. Esta mensagem possui alguma relevância para a área da saúde, mas espeficamente passo a passo de primeiros socorros e doenças. Responda 'True' para afirmativo ou 'False' para negativo: "+resposta.choices[0].message.content },
        ],
    });
    console.log(verificacao.choices[0].message.content)
    if(verificacao.choices[0].message.content=="True"){
      var databot = {
          author: 'bot',
          message: resposta.choices[0].message.content,
      }}
      else{
          var databot = {
            author: 'bot',
            message: 'Apresento-me como uma inteligência artificial especializada em abordar questões e respostas pertinentes a incidentes médicos. Lamento informar que encontrei dificuldades ao processar as informações fornecidas.',
        }
        
      };
      messages.push(data);
      messages.push(databot);
      console.log(databot);
      socket.emit('databot', databot);
      socket.broadcast.emit('receivedMessage', data);
  });
});

server.listen(3000, () => {
  console.log(`Servidor rodando`);
});