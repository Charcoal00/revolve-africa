const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    router.post("/register", async (req, res) => {
        try {
            const { email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser)
                return res.status(400).json({ error: "Email already in use." });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                email,
                password: hashedPassword,
            });

            await newUser.save();
            res.status(201).json({ message: "User registered successfully!" });
        } catch (error) {
            console.error("Registration Error:", error);
            res.status(500).json({ error: "Internal Server Error." });
        }
    });
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    } catch {
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
