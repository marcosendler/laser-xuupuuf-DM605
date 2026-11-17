// Placa simulada da DM605: serve a interface e responde como a placa (ESP3D / GRBL_ESP32),
// para testar e tirar prints sem o laser ligado. Sem dependencias, so Node.
//
//   node placa-simulada.js                         interface nova em http://localhost:8080
//   node placa-simulada.js ../../interface-original/index.html   interface de fabrica
//   PORTA=9000 TRABALHO_SEG=30 node placa-simulada.js
//
// Tudo fica em memoria: ao fechar, volta ao estado inicial.

const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');

const PORTA = parseInt(process.env.PORTA || '8080');
const PAGINA = path.resolve(process.argv[2] || path.join(__dirname, '..', 'index.html'));
const TRABALHO_SEG = parseFloat(process.env.TRABALHO_SEG || '90');

// ---------------------------------------------------------------- estado ----
const cfg = {
  // Wi-Fi (parametros $ do fabricante e nomes do ESP3D)
  'ESP110': 'STA', '50': '1', '51': 'DM605-Laser', '52': '12345678', '53': 'Oficina', '54': '********',
  'System/Hostname': 'dm605', 'Sta/IPMode': '0',
  'Sta/IP': '0.0.0.0', 'Sta/Netmask': '0.0.0.0', 'Sta/Gateway': '0.0.0.0', 'AP/IP': '192.168.0.1',
};
// GRBL ($$): valores de exemplo, nao sao os da placa real
const grbl = {
  0: 10, 1: 25, 2: 0, 3: 2, 4: 0, 5: 0, 6: 0, 10: 1, 11: 0.010, 12: 0.002, 13: 0,
  20: 0, 21: 1, 22: 1, 23: 3, 24: 100, 25: 3000, 26: 250, 27: 2, 28: 1000,
  30: 1000, 31: 0, 32: 1, 40: 1, 41: 1, 42: 0, 43: 1, 44: 1, 45: 0, 46: 4, 47: 0, 48: 0, 50: 1,
  60: 5, 61: 60, 100: 80, 101: 80, 102: 160, 103: 100, 104: 100, 105: 100,
  110: 6000, 111: 6000, 112: 1000, 120: 1500, 121: 1500, 122: 500,
  130: 410, 131: 400, 132: 50, 453: 0,
};
const redes = [
  ['Oficina', 92, 1], ['Casa_5G', 74, 1], ['Vizinho 2.4G', 51, 1], ['NET_VIRTUA_88', 38, 1],
  ['Cafe Visitantes', 30, 0], ['DM605-Laser', 99, 0],
];
const sd = new Map([
  ['/teste-quadrado.nc', 'G21\nG90\nM5\nG0 X20 Y20\nM3 S600\nG1 X120 Y20 F1200\nG1 X120 Y120\nG1 X20 Y120\nG1 X20 Y20\nM5\nG0 X0 Y0\n'],
  ['/logo-madeira.gcode', '; bounds: X30 Y40 to X180 Y110\nG21\nG90\nM4 S0\nG0 X30 Y40\nG1 X180 Y40 S800 F2000\nG1 X180 Y110\nG1 X30 Y110\nG1 X30 Y40\nM5\n'],
  ['/placa-acrilico.nc', 'G21\nG90\nG0 X10 Y10\nM3 S1000\nG1 X60 Y10 F600\nG1 X60 Y60\nG1 X10 Y60\nG1 X10 Y10\nM5\n'],
].map(([k, v]) => [k, Buffer.from(v)]));
const spiffs = new Map([['/index.html.gz', Buffer.alloc(190568)]]);

const m = { x: 0, y: 0, z: 0, estado: 'Idle', trabalho: null };
const clientes = new Set();
const log = (...a) => console.log(new Date().toTimeString().slice(0, 8), ...a);

// -------------------------------------------------------------- websocket ---
function quadro(op, dados) {
  const n = dados.length;
  const cab = n < 126 ? Buffer.from([0x80 | op, n])
    : n < 65536 ? Buffer.from([0x80 | op, 126, n >> 8, n & 255])
    : Buffer.concat([Buffer.from([0x80 | op, 127]), (() => { const b = Buffer.alloc(8); b.writeBigUInt64BE(BigInt(n)); return b })()]);
  return Buffer.concat([cab, dados]);
}
const wsTexto = (s, t) => t.write(quadro(1, Buffer.from(s)));
function wsLinhas(...linhas) {               // saida "serial" da placa: frames binarios terminados em \n
  const q = quadro(2, Buffer.from(linhas.map(l => l + '\n').join('')));
  for (const s of clientes) s.write(q);
}

function abrirWs(req, socket) {
  const chave = req.headers['sec-websocket-key'];
  if (!chave) return socket.destroy();
  const aceite = crypto.createHash('sha1').update(chave + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n' +
    'Sec-WebSocket-Accept: ' + aceite + '\r\nSec-WebSocket-Protocol: arduino\r\n\r\n');
  clientes.add(socket);
  wsTexto('CURRENT_ID:1', socket); wsTexto('ACTIVE_ID:1', socket);
  socket.on('data', b => {                   // so trata close e ping; a interface nao manda dados por aqui
    const op = b[0] & 15;
    if (op === 8) socket.end(quadro(8, Buffer.alloc(0)));
    if (op === 9) socket.write(quadro(10, Buffer.alloc(0)));
  });
  const sair = () => clientes.delete(socket);
  socket.on('close', sair); socket.on('error', sair);
}

// ---------------------------------------------------------------- maquina ---
const f3 = v => v.toFixed(3);
function status() {
  const t = m.trabalho;
  let est = m.estado, extra = '|FS:0,0';
  if (t) {
    const pct = Math.min(99.9, (Date.now() - t.inicio - t.pausado) / (TRABALHO_SEG * 10));
    if (est === 'Run') { m.x = 60 + 50 * Math.cos(pct / 3); m.y = 60 + 40 * Math.sin(pct / 3); extra = '|FS:1200,600' }
    extra += '|SD:' + pct.toFixed(2) + ',/sd' + t.arquivo;
    if (Date.now() - t.inicio - t.pausado >= TRABALHO_SEG * 1000 && est === 'Run') {
      log('trabalho concluido:', t.arquivo); m.trabalho = null; m.estado = 'Idle'; m.x = m.y = 0; extra = '|FS:0,0';
      est = 'Idle';
    }
  }
  return '<' + est + '|MPos:' + [m.x, m.y, m.z].map(f3).join(',') + extra + '|WCO:0.000,0.000,0.000>';
}

function mover(linha, absoluto) {
  let abs = absoluto;
  if (/G91/.test(linha)) abs = false;
  if (/G90/.test(linha)) abs = true;
  for (const [, eixo, v] of linha.matchAll(/([XYZ])\s*(-?[\d.]+)/g)) {
    const k = eixo.toLowerCase(), n = parseFloat(v);
    m[k] = abs ? n : m[k] + n;
  }
}

// devolve o texto da resposta HTTP; a saida "serial" vai pelo WebSocket
function comando(cmd) {
  if (cmd === '\x18') {
    if (m.trabalho) log('PARADA DE EMERGENCIA (reset)');
    m.trabalho = null; m.estado = 'Alarm';
    wsLinhas('Grbl 1.1f [\'$\' for help]', "[MSG:'$H'|'$X' to unlock]");
    return '';
  }
  if (cmd === '?') { wsLinhas(status()); return '' }
  if (cmd === '!') { if (m.estado === 'Run') { m.estado = 'Hold:0'; m.trabalho.pausaEm = Date.now() } return '' }
  if (cmd === '~') { if (m.estado.startsWith('Hold') && m.trabalho) { m.trabalho.pausado += Date.now() - m.trabalho.pausaEm; m.estado = 'Run' } return '' }

  let saida = '';
  for (const linha of cmd.split('\n').map(s => s.trim()).filter(Boolean)) saida += uma(linha);
  return saida;
}

function uma(l) {
  let r;
  // ---- comandos ESP3D
  if (l === '[ESP800]') return 'FW version:1.3a # FW target:grbl-embedded # FW HW:Direct SD # primary : /sd/ # secondary : /ext/ # ' +
    'authentication:no # webcommunication: Sync: ' + PORTA + ' # hostname:' + cfg['System/Hostname'] + ' # axis:3';
  if (l === '[ESP111]') return cfg.ESP110 === 'AP' ? cfg['AP/IP'] : '192.168.1.57';
  if (l === '[ESP400]') return JSON.stringify({ EEPROM: esp400() });
  if (l === '[ESP410]') return JSON.stringify({ AP_LIST: redes.map(([s, g, p]) => ({ SSID: s, SIGNAL: String(g), IS_PROTECTED: String(p) })) });
  if (l.startsWith('[ESP420]')) return ['Chip ID: 30344 (simulada)', 'CPU Frequency: 240Mhz', 'CPU Temperature: 51.1 C',
    'Free memory: 102.41 KB', 'SDK: v3.3.1', 'Board Version: DM605 (placa simulada)', 'Firmware: Grbl_ESP32 1.3a (simulado)',
    'Hostname: ' + cfg['System/Hostname'], 'Current WiFi Mode: ' + cfg.ESP110, 'Connected to: ' + cfg['53'], ''].join('\n');
  if (l === '[ESP200]') return 'SD card detected';
  if (l.startsWith('[ESP444]')) {
    log('reinicio pedido: derrubando o WebSocket por 3 s');
    setTimeout(() => { for (const s of clientes) s.destroy() }, 500);
    return 'ok';
  }
  if ((r = /^\[ESP220\](.+)$/.exec(l))) {
    const arq = ('/' + r[1].replace(/^\/?sd\//, '')).replace(/\/+/g, '/');
    if (!sd.has(arq)) { wsLinhas('error:61'); return 'error' }
    m.trabalho = { arquivo: arq, inicio: Date.now(), pausado: 0 }; m.estado = 'Run';
    log('trabalho iniciado:', arq, '(' + TRABALHO_SEG + ' s)');
    return 'ok';
  }
  if ((r = /^\[ESP401\]P=(\S+) T=\S+ V=(.*)$/.exec(l))) { cfg[r[1]] = r[2]; return 'ok' }
  if (l.startsWith('[ESP')) return 'ok';

  // ---- GRBL
  if (l === '$$') { wsLinhas(...Object.keys(grbl).map(k => '$' + k + '=' + grbl[k]), 'ok'); return '' }
  if (m.estado === 'Alarm' && !/^\$(X|H)/.test(l) && !/^\$[\w\/]+(=|$)/.test(l)) { wsLinhas('error:9'); return '' }
  if (l === '$X') { m.estado = 'Idle'; wsLinhas('[MSG:Caution: Unlocked]', 'ok'); return '' }
  if (/^\$H/.test(l)) { m.x = m.y = m.z = 0; m.estado = 'Idle'; wsLinhas('ok'); return '' }
  if (l.startsWith('$J=')) { mover(l.slice(3), true); wsLinhas('ok'); return '' }
  if ((r = /^\$([\w\/]+)=(.*)$/.exec(l))) {
    const [, k, v] = r;
    if (k in grbl) grbl[k] = isNaN(v) ? v : parseFloat(v);
    else if (k === 'Sta/IPMode') cfg[k] = /static/i.test(v) ? '1' : '0';
    else cfg[k] = v;
    log('gravado $' + k + '=' + v);
    wsLinhas('ok'); return '';
  }
  if ((r = /^\$([\w\/]+)$/.exec(l))) {
    const k = r[1], v = k in grbl ? grbl[k] : cfg[k];
    wsLinhas(v === undefined ? 'error:3' : '$' + k + '=' + v, ...(v === undefined ? [] : ['ok'])); return '';
  }
  if (/^[GM]/i.test(l)) mover(l, true);
  wsLinhas('ok');
  return '';
}

function esp400() {
  const s = (P, H, T, V, extra) => Object.assign({ F: 'network', P, T, V, H }, extra);
  return [
    s('System/Hostname', 'Hostname', 'S', cfg['System/Hostname'], { S: '32', M: '1' }),
    s('Radio/Mode', 'Radio mode', 'B', cfg.ESP110 === 'AP' ? '2' : '1', { O: [{ None: '0' }, { STA: '1' }, { AP: '2' }] }),
    s('Sta/SSID', 'Station SSID', 'S', cfg['53'], { S: '32', M: '1' }),
    s('Sta/Password', 'Station Password', 'S', '********', { S: '64', M: '8' }),
    s('Sta/IPMode', 'Station IP Mode', 'B', cfg['Sta/IPMode'], { O: [{ DHCP: '0' }, { Static: '1' }] }),
    s('Sta/IP', 'Station Static IP', 'A', cfg['Sta/IP']),
    s('Sta/Gateway', 'Station Static Gateway', 'A', cfg['Sta/Gateway']),
    s('Sta/Netmask', 'Station Static Mask', 'A', cfg['Sta/Netmask']),
    s('AP/SSID', 'AP SSID', 'S', cfg['51'], { S: '32', M: '1' }),
    s('AP/Password', 'AP Password', 'S', '********', { S: '64', M: '8' }),
    s('AP/IP', 'AP Static IP', 'A', cfg['AP/IP']),
  ];
}

// ---------------------------------------------------------------- arquivos --
function tamanho(n) {
  return n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(2) + ' KB' : n < 1073741824 ? (n / 1048576).toFixed(2) + ' MB' : (n / 1073741824).toFixed(2) + ' GB';
}
function lista(mapa, pasta, total) {
  const usado = [...mapa.values()].reduce((a, b) => a + b.length, 0);
  const files = [...mapa.keys()].filter(k => k.startsWith(pasta) && !k.slice(pasta.length).includes('/'))
    .map(k => ({ name: k.slice(pasta.length), shortname: k.slice(pasta.length), size: tamanho(mapa.get(k).length), datetime: '' }));
  return JSON.stringify({ files, path: pasta, total: tamanho(total), used: tamanho(usado),
    occupation: String(Math.max(1, Math.round(100 * usado / total))), mode: 'direct', status: 'Ok' });
}
function multipart(req, corpo) {               // extrai os arquivos de um form-data
  const b = /boundary=(?:"([^"]+)"|([^;]+))/.exec(req.headers['content-type'] || '');
  if (!b) return { campos: {}, arquivos: [] };
  const sep = Buffer.from('--' + (b[1] || b[2])), campos = {}, arquivos = [];
  let i = corpo.indexOf(sep);
  while (i >= 0) {
    const ini = i + sep.length + 2, fim = corpo.indexOf(sep, ini);
    if (fim < 0) break;
    const parte = corpo.slice(ini, fim - 2), h = parte.indexOf('\r\n\r\n');
    if (h >= 0) {
      const cab = parte.slice(0, h).toString(), dados = parte.slice(h + 4);
      const nome = /name="([^"]*)"/.exec(cab), arq = /filename="([^"]*)"/.exec(cab);
      if (arq) arquivos.push({ nome: arq[1], dados }); else if (nome) campos[nome[1]] = dados.toString();
    }
    i = fim;
  }
  return { campos, arquivos };
}
const juntar = (pasta, nome) => ('/' + pasta + '/' + nome.replace(/^.*[\\/]/, '')).replace(/\/+/g, '/');

// --------------------------------------------------------------------- http --
function query(url) {                          // decodifica sem trocar + por espaco (a interface usa encodeURI)
  const q = {}, i = url.indexOf('?');
  if (i >= 0) for (const p of url.slice(i + 1).split('&')) {
    const j = p.indexOf('='), k = j < 0 ? p : p.slice(0, j), v = j < 0 ? '' : p.slice(j + 1);
    try { q[decodeURIComponent(k)] = decodeURIComponent(v) } catch { q[k] = v }
  }
  return q;
}

function responder(req, res, corpo) {
  const rota = decodeURIComponent(req.url.split('?')[0]), q = query(req.url);
  const enviar = (txt, tipo = 'text/plain; charset=utf-8', cod = 200) => {
    res.writeHead(cod, { 'Content-Type': tipo, 'Cache-Control': 'no-store' }); res.end(txt);
  };

  if (rota === '/' || rota === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    return fs.createReadStream(PAGINA).pipe(res);
  }
  if (rota === '/command' || rota === '/command_silent') {
    const cmd = q.commandText ?? q.plain ?? '';
    if (cmd !== '?') log('comando:', JSON.stringify(cmd));
    return enviar(comando(cmd));
  }
  if (rota === '/login') return enviar(JSON.stringify({ status: 'Ok', authentication_lvl: 'admin' }), 'application/json');

  if (rota === '/upload') {                    // cartao SD
    const pasta = q.path || '/';
    if (req.method === 'POST') for (const a of multipart(req, corpo).arquivos) { sd.set(juntar(pasta, a.nome), a.dados); log('SD recebeu', a.nome, tamanho(a.dados.length)) }
    if (q.action === 'delete') { sd.delete(juntar(pasta, q.filename)); log('SD apagou', q.filename) }
    return enviar(lista(sd, pasta.endsWith('/') ? pasta : pasta + '/', 8e9), 'application/json');
  }
  if (rota === '/files') {                     // memoria interna (SPIFFS): onde fica a interface
    const pasta = q.path || '/';
    if (req.method === 'POST') {
      const mp = multipart(req, corpo);
      for (const a of mp.arquivos) {
        const nome = juntar(mp.campos.path || pasta, a.nome);
        spiffs.set(nome, a.dados); log('SPIFFS recebeu', nome, tamanho(a.dados.length),
          nome === '/index.html.gz' ? '<- interface enviada (simulado: nada muda aqui)' : '');
      }
    }
    if (q.action === 'delete') { spiffs.delete(juntar(pasta, q.filename)); log('SPIFFS apagou', q.filename) }
    return enviar(lista(spiffs, pasta.endsWith('/') ? pasta : pasta + '/', 1441792), 'application/json');
  }
  if (rota.startsWith('/SD/')) {
    const arq = ('/' + rota.slice(4)).replace(/\/+/g, '/');
    return sd.has(arq) ? enviar(sd.get(arq)) : enviar('', 'text/plain', 404);
  }
  if (spiffs.has(rota) && rota !== '/index.html.gz') return enviar(spiffs.get(rota), 'application/json');
  if (rota === '/events') { res.writeHead(200, { 'Content-Type': 'text/event-stream' }); return }
  enviar('Arquivo nao encontrado', 'text/plain', 404);
}

const srv = http.createServer((req, res) => {
  const partes = [];
  req.on('data', c => partes.push(c));
  req.on('end', () => {
    try { responder(req, res, Buffer.concat(partes)) } catch (e) { console.error(e); res.writeHead(500); res.end(String(e)) }
  });
});
srv.on('upgrade', abrirWs);
srv.listen(PORTA, () => {
  console.log('Placa simulada em http://localhost:' + PORTA);
  console.log('Pagina: ' + PAGINA);
  console.log('Trabalhos simulados duram ' + TRABALHO_SEG + ' s (TRABALHO_SEG=...). Ctrl+C para sair.\n');
});
