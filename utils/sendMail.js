
const ejs = require("ejs");
const transporter = require('../config/mailTransporter');

const sendMail = async (email,options, view, params = {}) => {
  const html = await ejs.renderFile(`views/${view}.ejs`, params);
  let mailOptions = {
    from: "info.univhn@gmail.com",
    to: email,
    subject: options.subject,
    html: html,
  };


  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
  
};

module.exports = sendMail;
