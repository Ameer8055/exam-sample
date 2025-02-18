const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const emailModel = require('../Model/EmailModel');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Create transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

// Generate random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Email options
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Save to database
        await emailModel.create({ email, otp });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Find the email record
        const record = await emailModel.findOne({ email });

        if (!record) {
            return res.status(404).json({ message: 'No OTP found for this email' });
        }

        // Check if OTP matches
        if (record.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if OTP is expired
        if (record.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // If all checks pass
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
});

module.exports = router;
