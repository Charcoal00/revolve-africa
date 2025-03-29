const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTP = async (email, otp) => {
    await transporter.sendMail({
        to: email,
        subject: "Verify Your Email",
        text: `Your OTP is: ${otp}`,
    });
};

module.exports = { sendOTP };
