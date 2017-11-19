const express = require('express');
const app = express();
const db = require("./db/knex");

app.get('/hi', function (req, res) {
    // res.json({bon: "good"});
    // res.send('Hello, World!');
    db.select().table('test2').then(x => {
      res.json(x);
    })
  });


  const DOMAIN = 'localhost';
  const PORT = '3001';
  app.listen(PORT, () => {
    console.log(`Server listenning on http://${DOMAIN}:${PORT}`);
  });
