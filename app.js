const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;
const app = express();

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

module.exports = { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req, res, next) => {
  req.user = {
    _id: '62a9e088d9876245920d0d54',
  };
  next();
});

app.use("/users", require('./routes/users'));
app.use("/cards", require('./routes/cards'));

app.use("*", (req, res, next) => {
  next(res.status(NOT_FOUND).send({ message: `Страница не найдена` }));
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
