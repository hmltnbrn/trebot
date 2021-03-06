const compression = require('compression');
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(compression());

app.use(express.static(__dirname + '/www/'));

require('dotenv-safe').config({
  allowEmptyValues: true
});

require('./bot');

app.listen(port);

//Handle Main Page
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/www/index.html'));
});

console.log(`Server listening on ${port}`);
