// Lanzador del Modulo C.A.B - robusto y con diagnostico visible
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function log(m){ try { process.stdout.write(String(m) + '\r\n'); } catch (e) {} }
function holdOpen(){
  log('');
  log('  (Esta ventana debe permanecer abierta. Para cerrar el modulo, cerra la ventana o Ctrl+C.)');
  try { process.stdin.resume(); } catch (e) {}
}
process.on('uncaughtException', function (err) {
  log(''); log('  ERROR INESPERADO:');
  log('  ' + (err && err.stack ? err.stack : err));
  holdOpen();
});

log('==================================================');
log('   Modulo C.A.B - CrediSolucion SAECA');
log('==================================================');

function loadHTML(){
  var candidates = [
    path.join(__dirname, 'index.html'),
    path.join(path.dirname(process.execPath), 'index.html'),
    path.join(process.cwd(), 'index.html')
  ];
  for (var i = 0; i < candidates.length; i++) {
    try {
      var data = fs.readFileSync(candidates[i]);
      log('   Modulo cargado (' + data.length + ' bytes) desde:');
      log('     ' + candidates[i]);
      return data;
    } catch (e) {}
  }
  return null;
}

function start(HTML, port){
  var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(HTML);
  });
  server.on('error', function (e) {
    if (e.code === 'EADDRINUSE' && port < 8820) {
      log('   Puerto ' + port + ' ocupado; probando ' + (port + 1) + '...');
      start(HTML, port + 1);
    } else {
      log('   ERROR al iniciar el servidor local: ' + e.message);
      holdOpen();
    }
  });
  server.listen(port, '127.0.0.1', function () {
    var url = 'http://127.0.0.1:' + port + '/';
    log('');
    log('   >> Modulo abierto en: ' + url);
    log('   >> Si no se abrio el navegador, pega esa direccion a mano.');
    log('   >> NO CIERRES ESTA VENTANA mientras uses el modulo.');
    try { exec('cmd /c start "" "' + url + '"'); } catch (e) {}
    holdOpen();
  });
}

var HTML = loadHTML();
if (!HTML) {
  log('');
  log('   ERROR: no se encontro "index.html".');
  log('   Deja "index.html" en la MISMA carpeta que ModuloCAB.exe y volve a intentar.');
  holdOpen();
} else {
  log('   Iniciando servidor local...');
  start(HTML, 8765);
}
