const nodemailer = require('nodemailer');
require('dotenv').config();

// Uses Gmail SMTP. In production prefer OAuth2 or a dedicated transactional email service.
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS; // app password or SMTP password

let transporter;
if (GMAIL_USER && GMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });
} else {
  // Fallback: console transport for development when env vars not set
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('Mailer fallback - email not sent (no GMAIL creds). Mail options:');
      console.log(mailOptions);
      return Promise.resolve({ accepted: [mailOptions.to], messageId: 'dev-fallback' });
    }
  };
}

module.exports = transporter;
