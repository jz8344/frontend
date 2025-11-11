import http from 'http';

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log(`📥 ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    status: 'ok', 
    message: 'Test server working!',
    port: PORT,
    url: req.url 
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`🌍 Listening on http://0.0.0.0:${PORT}`);
});
