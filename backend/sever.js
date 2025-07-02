require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/book', async (req, res) => {
  const data = req.body;

  const formatted = Object.entries(data)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join('\n');

  const mailOptions = {
    from: `"Next Wave Miami" <${process.env.EMAIL_USER}>`,
    to: 'nextwavemiamico@gmail.com',
    subject: '📥 New Swim Booking Submission',
    text: `New booking:\n\n${formatted}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Form submitted and email sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Email sending failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
