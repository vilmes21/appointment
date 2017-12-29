const express = require('express');
const app = express();
const db = require("./db/knex");

//morgan is a logger for development
var morgan = require('morgan');
// const myMorgan = morgan(":method :url :status :res[content-length] - :response-time ms");
// const myMorgan =morgan('combined', {
//   skip: function (req, res) { return res.statusCode < 400 }
// })
const myMorgan = morgan(":method :url :status :response-time ms - :res[content-length]");
app.use(myMorgan);


//BEGIN testing
var tests = require('./controllers/tests');
app.use('/tests', tests);

//END testing



app.get('/hi', function (req, res) {
  // res.json({bon: "good"});
  // res.send('Hello, World!');
  db.select().table('users').then(x => {
    res.json(x);
  })
});


const DOMAIN = 'localhost';
const PORT = '3001';
app.listen(PORT, () => {
  console.log(`Server listenning on http://${DOMAIN}:${PORT}`);
});