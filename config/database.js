const mongoose = require('mongoose')

const { MONGO_URI } = process.env


exports.connect = () => {
    // Connecting to the database
    mongoose.connect(MONGO_URI, (err) => {
        if (!err) return console.log("DB connected Successfully!");

        console.log(err);
    })
}