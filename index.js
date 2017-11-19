const express = require('express');
const app = express();
const knex = require("./models/knex");

app.get('/hi', function (req, res) {
    res.json({bon: "good"});
    // res.send('Hello, World!');
  });


  const DOMAIN = 'localhost';
  const PORT = '3000';
  app.listen(PORT, () => {
    console.log(`Server listenning on http://${DOMAIN}:${PORT}`);
  });
