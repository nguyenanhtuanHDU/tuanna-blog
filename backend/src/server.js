require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connection = require("./config/database");
const { signUpController, signInController } = require("./routes/auth");
const app = express()
// app.use(express.urlencoded())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const port = process.env.PORT
const hostname = process.env.HOST_NAME

const apiRoute = require('./routes/api')

app.get("/", (req, res) => {
    res.send('Welcome to tuanna-blog')
})

app.use('/v1/api', apiRoute)

app.post('/signup', signUpController)
app.post('/signin', signInController)

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




