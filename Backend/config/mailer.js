const nodemailer = require('nodemailer');
require('dotenv').config();

// Uses Gmail SMTP. In production prefer OAuth2 or a dedicated transactional email service.
const SMTP_USER = process.env.SMTP_USER || process.env.GMAIL_USER;
const SMTP_PASS = process.env.SMTP_PASS || process.env.GMAIL_PASS; // app password or SMTP password

let transporter;
if (SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
} else {
  // Fallback: console transport for development when env vars not set
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('Mailer fallback - email not sent (no SMTP credentials). Mail options:');
      console.log(mailOptions);
      return Promise.resolve({ accepted: [mailOptions.to], messageId: 'dev-fallback' });
    }
  };
}

module.exports = transporter;
