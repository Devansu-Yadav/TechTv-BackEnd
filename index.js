const express = require('express');
const app = express();
const { connectDB } = require("./db/db.connect");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});