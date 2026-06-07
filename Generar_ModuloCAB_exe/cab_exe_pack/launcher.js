// Lanzador del Modulo C.A.B - sirve el modulo en 127.0.0.1 (origen real) y abre el navegador
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const HTML = fs.readFileSync(path.join(__dirname, 'index.html'));

function start(port) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(HTML);
  });
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE' && port < 8820) { start(port + 1); }
    else { console.error('No se pudo iniciar el servidor local:', e.message); setTimeout(()=>process.exit(1), 8000); }
  });
  server.listen(port, '127.0.0.1', () => {
    const url = 'http://127.0.0.1:' + port + '/';
    console.log('');
    console.log('  Modulo C.A.B abierto en: ' + url);
    console.log('  (si no se abrio solo, pega esa direccion en tu navegador)');
    console.log('');
    console.log('  >> NO CIERRES ESTA VENTANA mientras uses el modulo.');
    console.log('  >> Para cerrar el modulo, cerra esta ventana.');
    try { exec('cmd /c start "" "' + url + '"'); } catch (e) {}
  });
}

console.log('==================================================');
console.log('   Modulo C.A.B - CrediSolucion SAECA');
console.log('==================================================');
console.log('   Iniciando, aguarde unos segundos...');
start(8765);
