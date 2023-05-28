require('dotenv').config();
const express = require('express')
const http = require('http');
const app = express();
const { Server } = require('socket.io')
const server = http.createServer(app)
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
var cors = require('cors');
const fileUpload = require('express-fileupload');
app.use(fileUpload({ useTempFile: true }));
const connection = require('./config/database');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
const port = process.env.PORT || 8888;
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
    server.listen(port, hostname, () => {
      console.log(`Server listening on port ${port}`);
    });
    global.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    // io.on('connection', (socket) => {
    //   socket.on('room1', (data) => {
    //     console.log(`🚀 ~ data:`, data)
    //   })
    // })
  } catch (error) {
    console.log(`🚀 ~ error:`, error)
  }
})();



