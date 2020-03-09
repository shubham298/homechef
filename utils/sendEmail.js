const nodemailer = require('nodemailer');

const sendEmail = async options => {
  console.log(typeof(process.env.GMAIL_EMAIL))
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
  port: 25,
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  const message = {
    from: `${process.env.GMAIL_EMAIL} <${process.env.GMAIL_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;