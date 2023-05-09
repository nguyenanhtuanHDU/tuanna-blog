require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
var cors = require('cors');
mongoose.set('strictQuery', true);
const fileUpload = require('express-fileupload');
app.use(fileUpload({ useTempFile: true }));
const connection = require('./config/database');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;

const apiRoute = require('./routes/api');
const authRoute = require('./routes/auth');
const uploadRoute = require('./routes/fileUpload');
const cookies = require('cookie-parser');
const path = require('path');

app.get('/', (req, res) => {
  res.send('Welcome to tuanna-blog');
});

app.use(cookies());

app.use(express.static(path.join('./src', 'public')));

app.use('/v1/api', apiRoute);
app.use('/auth', authRoute);
app.use('/upload', uploadRoute);

(async () => {
  try {
    await connection();
    app.listen(port, hostname, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
