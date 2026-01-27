const express = require('express');
const app = express();
const http = require('http');
const port = 3000;

/////////////BEGIN FILE SERVING//////////
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/main.js', (req, res) => {
  res.sendFile(__dirname + '/main.js');
});

app.get('/3js.js', (req, res) => {
  res.sendFile(__dirname + '/3js.js');
});

//remove if broke
app.use(express.static('public'))
/////////////END FILE SERVING//////////

//start the server 
app.listen(port, () => {
  console.log(`started and listening on ${port}`);
}); 
