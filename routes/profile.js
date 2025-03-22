const express = require("express");
const multer = require("multer");
const authenticateToken = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Multer Storage
const upload = multer({ dest: "uploads/" });

// Update Profile
router.patch(
    "/me2",
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



module.exports = router;
