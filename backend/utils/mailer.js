const nodemailer = require('nodemailer');

// Configuration for the SportsConnect Dedicated Mail Server
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // 1. Your dedicated project email address
    user: 'sportsconnectteamindia.app@gmail.com', 
    
    // 2. Your NEW 16-character App Password (spaces removed)
    pass: 'qosowxjpnffcigeh' 
  }
});

// Verify connection on server start
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mail Server Error:", error);
  } else {
    console.log("✅ Mail Server is ready to send notifications! 🚀");
  }
});

module.exports = transporter;