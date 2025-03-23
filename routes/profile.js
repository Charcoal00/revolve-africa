const express = require("express");
const multer = require("multer");
const authenticateToken = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Multer Storage
const upload = multer({ dest: "uploads/" });

// Update Profile
// router.patch(
//     "/me2",
//     authenticateToken,
//     upload.single("profilePicture"),
//     async (req, res) => {
//         try {
//             const updateData = req.body;
//             if (req.file)
//                 updateData["profile.profilePicture"] = req.file.filename;

//             const updatedUser = await User.findByIdAndUpdate(
//                 req.user.id,
//                 { $set: updateData },
//                 { new: true }
//             );
//             res.json({ message: "Profile updated", user: updatedUser });
//         } catch {
//             res.status(500).json({ error: "Profile update failed" });
//         }
//     }
// );
router.put("/", upload.single("profilePicture"), async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) updates.profilePicture = `/uploads/${req.file.filename}`;

        const user = await User.findOneAndUpdate(
            { email: req.user.email },
            updates,
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
});

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
