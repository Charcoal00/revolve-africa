const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        username: String,
        profile: {
            name: String,
            phone: String,
            location: String,
            profilePicture: String,
            headerImage: String,
            primarySkill: String,
            secondarySkills: [String],
            industry: String,
            specializations: [String],
            tools: [String],
            workExperience: String,
            achievements: String,
            projects: String,
            education: String,
            certifications: String,
            portfolio: String,
            videos: [String],
            audioFiles: [String],
            linkedin: String,
            twitter: String,
            website: String,
            otherSocial: [String],
            bio: String,
            services: String,
            testimonials: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);