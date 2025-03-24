const path = require("path"); // ✅ Add this line
const express = require("express");
const multer = require("multer");
const authenticateToken = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Multer Storage


// Ensure the uploads folder exists before storing files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../uploads");
        cb(null, uploadPath); // ✅ Ensure files are saved in a valid folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;

router.put(
    "/me",
    upload.single("profilePicture"),
    authenticateToken,
    async (req, res) => {
        try {
            const updates = { ...req.body };
            if (req.file)
                updates.profilePicture = `/uploads/${req.file.filename}`;

            const user = await User.findOneAndUpdate(
                { email: req.user.email },
                updates,
                { new: true }
            );
            if (!user)
                return res.status(404).json({ message: "User not found" });

            if (req.file) {
                user.profilePicture = `/uploads/${req.file.filename}`;
            }
            await user.save();
            res.json({ message: "Profile updated successfully", user });
        } catch (error) {
            res.status(500).json({ message: "Error updating profile", error });
        }
    }
);

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

module.exports = router;
