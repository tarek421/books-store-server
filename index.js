const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 8080;

const userName = process.env.DB_USER;
const DataBaseName = process.env.DB_NAME;
const password = process.env.DB_PASS;

const uri = `mongodb+srv://${userName}:${password}@cluster0.g7gsq.mongodb.net/${DataBaseName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!')
})


client.connect(err => {
  const collection = client.db("BookStore").collection("books");
  console.log(err);


  app.get('/books', (req, res) => {
    collection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  app.get('/book/:_id', (req, res) => {
    collection.find({ _id:ObjectId(req.params._id)})
      .toArray((err, items) => {
        res.send(items[0]);
      })
  })

  app.post('/addBook', (req, res) => {
    const newBook = req.body;
    console.log('adding new event: ', newBook)
    collection.insertOne(newBook)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })

  })

});

app.listen(port)