import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Nodemailer SMTP transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL from the start
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});


// Test route to send email
app.post("/send-email", async (req, res) => {
    const { email_rec, name_rec, otpCode } = req.body;
    try {
        await transporter.sendMail({
            from: `"FreshGuard" <${process.env.EMAIL}>`,
            to: email_rec, // ✅ use 'to'
            subject: "FreshGuard - OTP Verification",
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">FreshGuard Email Verification</h2>
            <p>Hello ${name_rec || 'User'},</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #4F4C9C; font-size: 32px; margin: 0;">${otpCode}</h1>
            </div>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <br>
            <p>Best regards,<br>FreshGuard Team</p>
        </div>`,
        });


        res.status(200).json({ success: true, message: "Email sent ✅" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("SMTP Email server running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
