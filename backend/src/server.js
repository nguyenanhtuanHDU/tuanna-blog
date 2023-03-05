require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
var cors = require('cors')
mongoose.set('strictQuery', true);
const connection = require("./config/database");
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ credentials: true, origin: "http://localhost:4200" }));
const port = process.env.PORT
const hostname = process.env.HOST_NAME

const apiRoute = require('./routes/api')
const authRoute = require('./routes/auth')

app.get("/", (req, res) => {
    res.send('Welcome to tuanna-blog')
})
const cookies = require("cookie-parser");

app.use(cookies());

app.use('/v1/api', apiRoute)
app.use('/auth', authRoute)



    ; (async () => {
        try {
            await connection()
            app.listen(port, hostname, () => {
                console.log(`Example app listening on port ${port}`)
            })
        } catch (error) {
            console.log(error);
        }
    })()




