const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // service: "smtp",
  host: "mail.ict.lviv.ua",
  port: 465,
  secure: true,
  auth: {
    user: "ict-info-logistics@ict.lviv.ua",
    pass: "Tfc34#sR51",
  },
});

const sendBuhTransport = async () => {
  const mailOptions = {
    from: "ict-info-logistics@ict.lviv.ua",
    to: "rt@ict.lviv.ua",
    subject: "Sending Email using Node.js",
    text: "Наші вантажі...........",
  };
  try {
    const mail = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  transporter,
  sendBuhTransport,
};
