const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, unique: true, match: /.+@.+\..+/ },
    password: { type: String },
    token: { type: String },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;