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
        // Get user input
        const { firstName, lastName, email, password } = req.body;

        // Validate user input
        if (!(email && password && firstName && lastName)) {
            res.status(400).json({ Notice: "All input is required" });
            // res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await UserModel.findOne({ email });
        // console.log(oldUser)
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
            // return res.json({ Error: "User Already Exist. Please Login" });
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            TOKEN_KEY,
            {
                expiresIn: "1h",
            }
        );

        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
        // res.json(user);


    } catch (err) {
        console.log("Error:  ", err);
    }

})



router.post('/login', async (req, res) => {

    try {
        // Get user input
        const { email, password } = req.body;


        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        // Validate if user exist in our database
        const user = await UserModel.findOne({ email });

        // console.log(user)

        if (user && (await bcrypt.compare(password, user.password))) {

            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                TOKEN_KEY,
                {
                    expiresIn: "1h",
                }
            );

            // save user token
            user.token = token;

            // user
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
