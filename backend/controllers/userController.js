const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register the user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    // Hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(`User Created:`, user);

    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//@desc Login the user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log("Login Request Received:", { email, password });

    if (!email || !password) {
        console.log("Missing Fields");
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({ email });

    if (!user) {
        console.log("User Not Found");
        res.status(401);
        throw new Error("Email or password is not valid");
    }

    console.log("User Found:", user);

    // Compare hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isPasswordMatch);

    if (user && isPasswordMatch) {
        try {
            const accessToken = jwt.sign(
                {
                    user: {
                        username: user.username,
                        email: user.email,
                        id: user.id,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET, // Ensure this is set correctly
                { expiresIn: "1h" } // Increased expiry for debugging
            );

            console.log("Token Generated:", accessToken);

            // Send response and end request properly
            return res.status(200).json({ accessToken });
        } catch (error) {
            console.error("JWT Signing Error:", error);
            res.status(500);
            throw new Error("Failed to generate access token");
        }
    } else {
        console.log("Invalid Credentials");
        res.status(401);
        throw new Error("Email or password is not valid");
    }
});



//@desc Get Current User Info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json({ message: "Current user" });
});

module.exports = { registerUser, loginUser, currentUser };
