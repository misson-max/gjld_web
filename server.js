const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;
const dir = __dirname;

const mime = {
  '.html': 'text/html;charset=utf-8',
  '.css': 'text/css;charset=utf-8',
  '.js': 'application/javascript;charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  let filePath = path.join(dir, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
      res.end('<h1>404 未找到</h1>');
    } else {
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      res.end(data);
    }
  });
}).listen(port, '0.0.0.0', () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  let ip = '127.0.0.1';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) { ip = net.address; break; }
    }
    if (ip !== '127.0.0.1') break;
  }
  console.log('========================================');
  console.log('  绞股蓝农业科技 - 本地服务器已启动');
  console.log('  电脑访问: http://localhost:' + port);
  console.log('  手机访问: http://' + ip + ':' + port);
  console.log('========================================');
  console.log('  按 Ctrl+C 停止服务');
});
