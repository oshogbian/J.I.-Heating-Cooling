
const https = require('https');

const url = 'https://j-i-heating-cooling-2.onrender.com';

function pingServer() {
  console.log(`Pinging ${url} at ${new Date().toLocaleTimeString()}`);
  
  https.get(url, (res) => {
    console.log(`✅ Server responded: ${res.statusCode}`);
  }).on('error', (err) => {
    console.log(`❌ Error: ${err.message}`);
  });
}


setInterval(pingServer, 600000);

pingServer();

console.log('Keep-alive script started. Press Ctrl+C to stop.'); 