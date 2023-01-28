const express = require('express');
const bodyParser = require('body-parser');
const queryType = require('query-types');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(queryType.middleware());

const router = require('./routes')
app.use(router);

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${5000}`)
})