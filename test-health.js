const http = require('http');

http.get('http://localhost:5000/api/v1/health', (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      console.log(rawData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
