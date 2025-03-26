const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        username: { type: String, default: "" },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        profilePicture: { type: String, default: "" },
        primarySkill: { type: String, default: "" },
        secondarySkills: { type: String, default: "" },
        industry: { type: String, default: "" },
        specializations: { type: String, default: "" },
        tools: { type: String, default: "" },
        workExperience: { type: String, default: "" },
        achievements: { type: String, default: "" },
        projects: { type: String, default: "" },
        education: { type: String, default: "" },
        certifications: { type: String, default: "" },
        portfolio: { type: String, default: "" },
        videos: { type: String, default: "" },
        audioFiles: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        website: { type: String, default: "" },
        otherSocial: { type: String, default: "" },
        bio: { type: String, default: "" },
        services: { type: String, default: "" },
        testimonials: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
