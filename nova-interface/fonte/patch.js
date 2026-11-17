// Aplica as melhorias no index.html original e grava index.html + index.html.gz
const fs = require('fs'), zlib = require('zlib');
const [, , src, outDir] = process.argv;
let h = fs.readFileSync(src, 'utf8');

function rep(oldStr, newStr, label) {
  const n = h.split(oldStr).length - 1;
  if (n !== 1) throw new Error(`[${label}] esperado 1 ocorrencia, achou ${n}`);
  h = h.replace(oldStr, () => newStr);
  console.log('ok  ', label);
}
function repAll(oldStr, newStr, count, label) {
  const n = h.split(oldStr).length - 1;
  if (n !== count) throw new Error(`[${label}] esperado ${count} ocorrencias, achou ${n}`);
  h = h.split(oldStr).join(newStr);
  console.log('ok  ', label, `(${n}x)`);
}

// --- Seguranca ---------------------------------------------------------------
rep('function alertdlg(e,t,a){',
  'function esc_html(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\'/g,"&#39;")}function alertdlg(e,t,a){',
  'helper esc_html');

rep('response.startsWith("beep(")&&eval(response)',
  'function(){var m=/^beep\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)/.exec(response);m&&beep(parseInt(m[1]),parseInt(m[2]))}()',
  'remove eval(response) do beep');

repAll('currenttrans=eval(language_list[lang_i][2])', 'currenttrans=window[language_list[lang_i][2]]', 2,
  'remove eval das traducoes');

repAll('?t+=a.sdname:t+=a.name', '?t+=esc_html(a.sdname):t+=esc_html(a.name)', 2, 'escapa nomes de arquivo');

rep('document.getElementById("print_prg_name").innerHTML="&nbsp;&nbsp;"+r',
  'document.getElementById("print_prg_name").innerHTML="&nbsp;&nbsp;"+esc_html(r)', 'escapa nome do trabalho');

rep('<span>"+files_currentPath+"</span>', '<span>"+esc_html(files_currentPath)+"</span>', 'escapa pasta atual');

rep('m=m.replace("&","&amp;"),m=m.replace("<","&lt;"),m=m.replace(">","&gt;")',
  'm=m.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")', 'escape completo no monitor');

// --- Laser --------------------------------------------------------------------
rep('function SendLaserSpindlecommand(e){',
  'function SendLaserSpindlecommand(e){if(0==e)return void SendPrinterCommand("M5",!0);', 'botao DESL envia M5');

// Enquadramento: contorno so dos movimentos de corte, sem incluir a origem a forca
const a = h.indexOf('function read_file_response_text(e){');
const endMark = 'console.log(maxX,maxY,minX,minY),console.log("end-------------"+new Date)}';
const b = h.indexOf(endMark, a);
if (a < 0 || b < 0 || h.indexOf('function read_file_response_text(e){', a + 1) >= 0) throw new Error('[enquadramento] ancora');
const frameFn = 'function read_file_response_text(e){' +
  'var t=/bounds:?\\s*x\\s*(-?[\\d.]+)\\s*y\\s*(-?[\\d.]+)\\s*to\\s*x\\s*(-?[\\d.]+)\\s*y\\s*(-?[\\d.]+)/i.exec(e);' +
  'if(t)minX=parseFloat(t[1]),minY=parseFloat(t[2]),maxX=parseFloat(t[3]),maxY=parseFloat(t[4]);else{' +
  'minX=minY=1/0,maxX=maxY=-1/0;for(var a=e.split("\\n"),n=0,r=!0,o=!0,i=1,l=0,s=0,d=0;d<a.length;d++){' +
  'for(var c,u=a[d].replace(/\\(.*?\\)/g,"").split(";")[0].toUpperCase(),p=/([A-Z])\\s*([-+]?\\d*\\.?\\d+)/g,f=l,g=s,m=!1;c=p.exec(u);){' +
  'var v=parseFloat(c[2]);"G"==c[1]?(0==v||1==v||2==v||3==v)&&(n=v):"X"==c[1]?(f=r?v:l+v,m=!0):"Y"==c[1]?(g=r?v:s+v,m=!0):"S"==c[1]?i=v:"M"==c[1]&&(3==v||4==v?o=!0:5==v&&(o=!1));' +
  '"G"==c[1]&&(90==v?r=!0:91==v&&(r=!1))}' +
  'm&&(0!=n&&o&&0<i&&(minX=Math.min(minX,l,f),maxX=Math.max(maxX,l,f),minY=Math.min(minY,s,g),maxY=Math.max(maxY,s,g)),l=f,s=g)}' +
  'isFinite(minX)||(minX=maxX=minY=maxY=0)}' +
  'minX=Math.round(1e3*minX)/1e3,maxX=Math.round(1e3*maxX)/1e3,minY=Math.round(1e3*minY)/1e3,maxY=Math.round(1e3*maxY)/1e3}';
h = h.slice(0, a) + frameFn + h.slice(b + endMark.length);
console.log('ok   enquadramento');

// --- Idioma -------------------------------------------------------------------
rep(">English</button>",
  ">English</button> <button class=\"lanbtn\" id=\"lanbtnptbr\" onclick=\"setLanguage(event, 'lanbtnzh', 'languagebtns', 'ptbr')\">Português (Brasil)</button>",
  'botao Portugues');

// --- Complemento --------------------------------------------------------------
const addon = fs.readFileSync(__dirname + '/laser_addon.js', 'utf8');
const ui = fs.readFileSync(__dirname + '/laser_ui.js', 'utf8') + '\n' + fs.readFileSync(__dirname + '/laser_config.js', 'utf8');
rep('</script></body>', '</script><script>' + addon + '</script><script>' + ui + '</script></body>', 'injeta complemento');

// --- Tema: CSS no <head> e tema aplicado antes de desenhar a pagina -----------
const css = fs.readFileSync(__dirname + '/laser_theme.css', 'utf8');
rep('</head>', '<style>' + css + '</style><script>(function(){var t="dark";try{t=localStorage.getItem("laser_theme")||"dark"}catch(e){}"dark"==t&&(document.documentElement.className+=" theme-dark")})()</script></head>', 'injeta tema');

fs.writeFileSync(outDir + '/index.html', h);
const gz = zlib.gzipSync(Buffer.from(h, 'utf8'), { level: 9 });
fs.writeFileSync(outDir + '/index.html.gz', gz);
console.log('index.html', h.length, 'bytes | index.html.gz', gz.length, 'bytes');
