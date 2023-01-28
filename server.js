const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

const router = require('./routes')
app.use(router);

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${5000}`)
})