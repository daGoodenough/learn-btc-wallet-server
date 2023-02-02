require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const queryType = require('query-types');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false); 
const cors = require('cors');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.kph3znu.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB Atlas cluster!');
});

const app = express();

app.use(cors({credentials: true, origin: true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(queryType.middleware());

const router = require('./routes')
app.use(router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${5000}`)
})