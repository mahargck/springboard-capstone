try {
  process.loadEnvFile(); 
} catch(e) {
  // Servers will not have local files thus triggering an error.
  console.log('Missing ".env" file')
}

const http = require('http')
const app = require('./app.js');

const server = http.createServer(app);

const PORT = process.env.PORT || 3000
server.listen(PORT);
