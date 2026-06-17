// const nodemailer = require('nodemailer');

// // FORCED CONFIGURATION: Hardcoded to bypass any faulty .env variable injections
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'sportsconnectteamindia.app@gmail.com', 
//     pass: 'qosowxjpnffcigeh' 
//   }
// });

// // Verify connection on server start
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("❌ Mail Server Error:", error);
//   } else {
//     console.log("✅ Mail Server is ready to send notifications! 🚀");
//   }
// });

// module.exports = transporter;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    // Hardcoded strings ensure dotenv variables are ignored entirely
    user: 'sportsconnectteamindia@gmail.com', 
    pass: 'bjqxwhdkkqqkfkzm' 
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mail Server Error:", error.message);
  } else {
    console.log("✅ Mail Server is ready to send notifications! 🚀");
  }
});

module.exports = transporter;