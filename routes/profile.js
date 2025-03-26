const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
const authenticateToken = require("../middleware/auth");
const User = require("../models/User");

dotenv.config();
const router = express.Router();

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage setup for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const upload = multer({ storage });



// GET user profile
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // ✅ Fetch by ID instead of email
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


// UPDATE profile with image upload
router.put(
    "/edit",
    authenticateToken,
    upload.single("profilePicture"),
    async (req, res) => {
        // console.log("Received Data:", req.body); 

        try {
            // console.log("making progress")
            const user = await User.findById(req.user.userId);
            // console.log(user, "user");
            if (!user) return res.status(404).json({ error: "User not found" });

            Object.assign(user, req.body); // Update user fields
            await user.save();

            res.json({ message: "Profile updated successfully", user });
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ error: "Server error" });
        }
    }
);

module.exports = router;
