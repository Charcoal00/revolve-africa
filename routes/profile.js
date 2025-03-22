const express = require("express");
const multer = require("multer");
const authenticateToken = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Multer Storage
const upload = multer({ dest: "uploads/" });

// Update Profile
router.patch(
    "/me",
    authenticateToken,
    upload.single("profilePicture"),
    async (req, res) => {
        try {
            const updateData = req.body;
            if (req.file)
                updateData["profile.profilePicture"] = req.file.filename;

            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                { $set: updateData },
                { new: true }
            );
            res.json({ message: "Profile updated", user: updatedUser });
        } catch {
            res.status(500).json({ error: "Profile update failed" });
        }
    }
);

router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assuming the token has user ID (req.user.id)
        if (!user) return res.status(404).json({ error: "User not found." });

        res.json({
            name: user.name || "Not provided",
            email: user.email,
            phone: user.phone || "Not Provided",
            location: user.location || "Not Provided"
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
