require("dotenv").config({ path: './.env' });
const { API_PORT, MONGO_URI } = process.env;

const mongoose = require('mongoose')
const express = require('express')
const app = express()

const PORT = process.env.PORT || API_PORT


const userRouter = require('./routes/users')
const authRouter = require('./routes/authenticate')


app.use((req, res, next) => {
    console.log(`${new Date()} - ${req.method} - ${req.url}`)
    next();
})


app.use(express.json())

app.use('/', userRouter);
app.use('/', authRouter);



mongoose.connect(MONGO_URI, (err) => {
    if (!err) return console.log("DB connected Successfully!");

    console.log(err);
})


app.listen(PORT, (error) => {
    if (!error) return console.log(`Server starts at Port ${PORT}`);

    console.log(error);
})