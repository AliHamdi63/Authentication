const express = require('express')
// const bcrypt = require("bcryptjs")
// const jwt = require("jsonwebtoken")
const router = express.Router()

const auth = require("../middleware/auth");


router.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});



module.exports = router;