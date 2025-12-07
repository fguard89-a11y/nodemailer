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
    const { to, subject, text } = req.body;

    try {
        await transporter.sendMail({
            from: `"FreshGuard" <${process.env.EMAIL}>`,
            to,
            subject,
            text,
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
