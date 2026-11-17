// Serve a interface nova em http://localhost:8080 e repassa o resto para a placa
const http = require('http'), fs = require('fs'), path = require('path');
const BOARD = '10.128.1.112', PORT = 8080;
const page = path.join(__dirname, '..', 'index.html');
http.createServer((req, res) => {
  if (req.url === '/' || req.url.startsWith('/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    return fs.createReadStream(page).pipe(res);
  }
  const p = http.request({ host: BOARD, port: 80, path: req.url, method: req.method, headers: { ...req.headers, host: BOARD } }, r => {
    res.writeHead(r.statusCode, r.headers); r.pipe(res);
  });
  p.on('error', e => { res.writeHead(502); res.end(String(e)); });
  req.pipe(p);
}).listen(PORT, () => console.log('Teste em http://localhost:' + PORT));
