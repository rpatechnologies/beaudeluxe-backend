const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const models = require("../models");
const emailTemplate = models.emailTemplate;
const Setting = models.setting;
const { settingData } = require("../utils/global.helper");

const adminEmail = async () => {
  const data = await settingData();
  return data.email;
};
const adminCareerEmail = async () => {
  const data = await settingData();
  return data.career_email;
};

const adminEmails = async () => {
  const data = await settingData();
  return data.mails_to.split(",").map((email) => email.trim());
  return ["info@beaudeluxe.com"];
};

const sendEmail = async (sendTo, type, subject = NULL, vars = {}) => {
  try {
    const emailContent = await emailTemplate.findOne({ where: { type: type } });
    var emailBody = emailContent.content;
    for (const key in vars) {
      emailBody = emailBody.replace("{{" + key + "}}", vars[key]);
    }

    const templatePath = path.resolve("src/views/templates/email.handle.html");

    let template = fs.readFileSync(templatePath, "utf8");

    template = template.replace(`{{body}}`, emailBody);

    var settings = await Setting.findAll();

    let settingsObj = {};
    for (let q = 0; q < settings.length; q++) {
      settingsObj[settings[q]["field"]] = settings[q]["value"];
    }

    // console.log(settingsObj);

    var mailOptions = {
      from: `"Beaudeluxe" <${settingsObj["smtp_username"]}>`,
      to: String(sendTo),
      subject: subject
        ? subject
        : emailContent.subject,
      html: template,
    };

    const transporter = nodemailer.createTransport({
      host: settingsObj["smtp_host"],
      port: settingsObj["smtp_port"],
      secure: false,
      auth: {
        user: settingsObj["smtp_username"],
        pass: settingsObj["smtp_password"],
      },
      // tls: {
      //   servername: "mail.secured.unisystechnologies.ae", // override SNI to match certificate
      // },
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error, "errors");
      }
      console.log("Message sent: " + info.response);
      return;
    });
  } catch (error) {
    console.log(error);
  }
};

const sendMultipleEmail = async (sendTo, type, subject = NULL, vars = {}) => {
  const emailContent = await emailTemplate.findOne({ where: { type: type } });
  var emailBody = emailContent.content;
  for (const key in vars) {
    emailBody = emailBody.replace("{{" + key + "}}", vars[key]);
  }

  const templatePath = path.resolve("src/views/templates/email.handle.html");

  let template = fs.readFileSync(templatePath, "utf8");

  template = template.replace(`{{body}}`, emailBody);

  var settings = await Setting.findAll();
  let settingsObj = {};
  for (let q = 0; q < settings.length; q++) {
    settingsObj[settings[q]["field"]] = settings[q]["value"];
  }

  const transporter = nodemailer.createTransport({
    host: settingsObj["smtp_host"],
    port: settingsObj["smtp_port"],
    secure: false,
    auth: {
      user: settingsObj["smtp_username"],
      pass: settingsObj["smtp_password"],
    },
  });

  var mailOptions = {
    from: `"Beaudeluxe" <${settingsObj["from_email"]}>`,
    to: sendTo,
    subject: subject
      ? subject
      : emailContent.subject + (vars["service"] ? " - " + vars["service"] : ""),
    html: template,
    attachments: [],
  };

  if (vars["path"] && vars["path"] != "") {
    mailOptions.attachments.push({
      filename: vars["path"].split("/").pop(),
      path: vars["path"],
    });
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
    return;
  });
};

module.exports = {
  adminEmail,
  adminCareerEmail,
  adminEmails,
  sendEmail,
  sendMultipleEmail,
};
// const nodemailer = require("nodemailer");
// const fs = require("fs");
// const path = require("path");
// const models = require("../models");
// const emailTemplate = models.emailTemplate;
// const Setting = models.setting;
// const { settingData } = require("../utils/global.helper");

// const transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'info@beaudeluxe.com',
//         pass: 'Beaudeluxe2022'
//     }
// });

// const adminEmail = async () => {
//     const data = await settingData();
//     return data.email;
//     // return "testingrpa27@gmail.com";
// };
// const adminCareerEmail = async () => {
//     const data = await settingData();
//     return data.career_email;
//     // return "testingrpa27@gmail.com";
// };

// const adminEmails = () => {
//     return ["arshad.pwt@gmail.com", "testingrpa27@gmail.com"];
// };

// const sendEmail = async (sendTo, type, subject=NULL, vars = {}) => {
// 	const emailContent = await emailTemplate.findOne({ where: {type: type} });
//     var emailBody = emailContent.content;
//     for (const key in vars) {
//         emailBody = emailBody.replace('{{'+key+'}}', vars[key]);
//     }

//     const templatePath = path.resolve("src/views/templates/email.handle.html");

//     let template = fs.readFileSync(templatePath, "utf8");

//     template = template.replace(`{{body}}`, emailBody);

//     var mailOptions = {
//         from: '"Beaudeluxe" <info@beaudeluxe.com>',
//         to: [String(sendTo)],
//         subject: subject ? subject : emailContent.subject,
//         html: template,
//     };

//     //  attachments: [
//     //         {
//     //             filename: filename,
//     //             path: filePath
//     //         },
//     //    ]

//     transporter.sendMail(mailOptions, function(error, info){
//         if(error) {
//             return console.log(error);
//         }
//         console.log('Message sent: ' + info.response);
//         return;
//     });
// };

// const sendMultipleEmail = async (sendTo, type, subject=NULL, vars = {}) => {
// 	const emailContent = await emailTemplate.findOne({ where: {type: type} });
//     var emailBody = emailContent.content;
//     for (const key in vars) {
//         emailBody = emailBody.replace('{{'+key+'}}', vars[key]);
//     }

//     const templatePath = path.resolve("src/views/templates/email.handle.html");

//     let template = fs.readFileSync(templatePath, "utf8");

//     template = template.replace(`{{body}}`, emailBody);

//     var mailOptions = {
//         from: '"Beaudeluxe" <info@beaudeluxe.com>',
//         to: sendTo,
//         subject: subject ? subject : emailContent.subject,
//         html: template,
//     };

//     transporter.sendMail(mailOptions, function(error, info){
//         if(error) {
//             return console.log(error);
//         }
//         console.log('Message sent: ' + info.response);
//         return;
//     });
// };

// module.exports = {
//     adminEmail,
//     adminCareerEmail,
//     adminEmails,
//     sendEmail,
//     sendMultipleEmail
// }
