require("dotenv").config({ path: './.env' });
require("./config/database").connect();
// const app = require("./app");
const express = require('express')

const app = express()

const { API_PORT } = process.env;
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




app.listen(PORT, (error) => {
    if (!error) return console.log(`Server starts at Port ${PORT}`);

    console.log(error);
})