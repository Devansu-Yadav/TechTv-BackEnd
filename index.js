const express = require('express');
const app = express();
const { connectDB } = require("./db/db.connect");
const { videosRouter } = require("./routes/videos.route");
const { videoCategoryRouter } = require("./routes/categories.route");
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

app.use("/api/videos", videosRouter);
app.use("/api/categories", videoCategoryRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});