const mongoose = require("mongoose");

const TempAdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 }, // Auto-delete after 1 minutes
});

module.exports = mongoose.model("TempAdmin", TempAdminSchema);
