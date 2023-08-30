const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

const server = https.createServer(options, (req, res) => {
  const htmlFilePath = path.join(__dirname, '..', 'modelo.html');
  const cssFilePath = path.join(__dirname, '..', 'style.css');
  const jsFilePath = path.join(__dirname, '..', 'js.js');
  const imagesFolderPath = path.join(__dirname, '..', 'imagem');

  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    fs.readFile(htmlFilePath, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Erro ao ler o arquivo HTML');
      } else {
        res.end(data);
      }
    });
  } else if (req.url === '/style.css') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/css');
    fs.readFile(cssFilePath, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Erro ao ler o arquivo CSS');
      } else {
        res.end(data);
      }
    });
  } else if (req.url === '/js.js') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/javascript');
    fs.readFile(jsFilePath, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Erro ao ler o arquivo JavaScript');
      } else {
        res.end(data);
      }
    });
  } else if (req.url.startsWith('/imagem/')) {
    const imageFileName = req.url.substring(8);
    const imageFilePath = path.join(imagesFolderPath, imageFileName);
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/png'); // Ajuste para o tipo correto da imagem
    fs.readFile(imageFilePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Imagem não encontrada');
      } else {
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Página não encontrada');
  }
});

server.listen(443, () => {
  console.log('Servidor HTTPS rodando na porta 443');
});
