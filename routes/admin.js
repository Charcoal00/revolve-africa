const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const TempAdmin = require("../models/TempAdmin");
const Admin = require("../models/Admin");
const { sendOTP } = require("../utils/nodemailer");
const User = require("../models/User");
const adminToken = require("../middleware/adminAuth");

const router = express.Router();

router.post("/register", async (req, res) => {
    // console.log("Received request:", req.body); // Debugging log

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    const existingAdmin2 = await TempAdmin.findOne({ email });

    if (existingAdmin || existingAdmin2) {
        return res.status(400).json({ msg: "Admin already exists." });
    }

    try {
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        console.log(otp);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new TempAdmin({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        await newAdmin.save();
        // console.log(`Created new admin: ${newAdmin}`

        await sendOTP(email, otp);
        res.json({ msg: "OTP sent, verify to complete registration" });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    try {
        const tempAdmin = await TempAdmin.findOne({
            email,
            otp,
            otpExpires: { $gt: new Date() },
        });
        if (!tempAdmin)
            return res.status(400).json({ msg: "Invalid or expired OTP" });

        // Move verified admin to `Admin` collection
        const newAdmin = new Admin({
            name: tempAdmin.name,
            email: tempAdmin.email,
            password: tempAdmin.password,
        });
        await newAdmin.save();

        // Delete admin from `TempAdmin` after verification
        await TempAdmin.deleteOne({ email });

        res.json({ msg: "Account verified successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin)
        return res.status(400).json({ msg: "Admin not found or not verified" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    res.json({ msg: "Login successful", token });
});

router.get("/profile", adminToken, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select("name email");
        if (!admin) return res.status(404).json({ msg: "Admin not found" });

        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.get("/users", adminToken, async (req, res) => {
    try {
        const users = await User.find({}, "name username email phone location");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Error fetching user details" });
    }
});
module.exports = router;
