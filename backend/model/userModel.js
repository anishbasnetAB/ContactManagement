const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please add the user name"],
            unique: true, // Fix: unique should not have an array error message
        },
        email: {
            type: String,
            required: [true, "Please add the email address"],
            unique: true, 
        },
        password: {
            type: String,
            required: [true, "Please add the password"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
