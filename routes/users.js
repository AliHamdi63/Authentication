const express = require('express')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = express.Router()
const UserModel = require("../models/user")
const { TOKEN_KEY } = process.env;

// console.log(TOKEN_KEY)
router.get('/', async (req, res) => {

    try {
        const users = await UserModel.find({});
        res.json(users);
    }
    catch (err) {

        res.status(500).json({ code: "DB ERROR" })
    }
})




router.post('/register', async (req, res) => {

    try {

        const { firstName, lastName, email, password } = req.body;

        if (!(email && password && firstName && lastName)) {
            res.status(400).json({ Notice: "All input is required" });
        }

        const oldUser = await UserModel.findOne({ email });
        // console.log(oldUser)
        if (oldUser) {
            return res.json({ Error: "User Already Exist. Please Login" });
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        const token = jwt.sign(
            { user_id: user._id, email },
            TOKEN_KEY,
            {
                expiresIn: "1h",
            }
        );

        user.token = token;
        res.json(user);

    } catch (err) {
        console.log("Error:  ", err);
    }

})



router.post('/login', async (req, res) => {

    try {

        const { _id, email, password } = req.body;

        // console.log(_id, email, password)

        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        const user = await UserModel.findOne({ _id });

        // console.log(user)

        if (user && (await bcrypt.compare(password, user.password))) {

            const token = jwt.sign(
                { user_id: user._id, email },
                TOKEN_KEY,
                {
                    expiresIn: "1h",
                }
            );

            user.token = token;

            res.status(200).json(user);

        }
        else {
            res.status(400).send("Invalid Credentials");

        }
    } catch (err) {
        res.json({ Error: "Invalid" })
        console.log(err);
    }

})




router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;
        const user = await UserModel.findByIdAndDelete(id)
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ code: "DB ERROR" })
    }
})




module.exports = router
