const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register

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

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res
                .status(401)
                .json({ message: "Invalid Username or Password" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        res.json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assuming the token has user ID (req.user.id)
        if (!user) return res.status(404).json({ error: "User not found." });

        res.json({
            name: user.name || "Not provided",
            email: user.email,
            phone: user.phone || "Not Provided",
            location: user.location || "Not Provided",
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
