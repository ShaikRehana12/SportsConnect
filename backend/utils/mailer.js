const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify((error) => {
  if (error) {
    console.error("Mail server configuration error:", error.message);
  } else {
    console.log("Mail server is ready to send notifications.");
  }
});

module.exports = transporter;
