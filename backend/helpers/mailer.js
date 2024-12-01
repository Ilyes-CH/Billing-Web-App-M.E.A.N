const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ilyes.leo.ch@gmail.com',
    pass: 'ykxl xvim mvmr zviu'
  }
});

// Set up Handlebars options
const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve(__dirname,'../views/'),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname,'../views/'),
  extName: '.hbs',
};

// Attach the Handlebars plugin to the Nodemailer transporter
transporter.use('compile', hbs(handlebarOptions));

/**
 * Sends an email with an attachment.
 * @param {string} userName - Name of the user sending the email.
 * @param {string} recipientEmail - Email address of the recipient.
 * @param {string} subject - Subject of the email.
 * @param {string} htmlFile - Handlebars template file name (without extension).
 * @param {string} attachment - Filename of the attachment to send.
 * @param {any} data - Additional data for handlebars template.
 */
const sendEmailWithAttachment = (userName, recipientEmail, subject, htmlFile, attachment, data) => {
  const mailOptions = {
    from: 'ilyes.leo.ch@gmail.com',
    to: recipientEmail,
    subject: subject,
    template: htmlFile, // Name of the HBS file without the extension
    context: { // Data to fill the placeholders
      userName: userName,
      date: new Date().toLocaleDateString(), // Formatted date
    },
    attachments: [
      {
        filename: attachment,
        path: path.join(__dirname, `../uploads/pdfs/${attachment}`), // Path to the generated PDF file
      }
    ],
    data: data,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

/**
 * Sends an email without an attachment.
 * @param {string} userName - Name of the user sending the email.
 * @param {string} recipientEmail - Email address of the recipient.
 * @param {string} subject - Subject of the email.
 * @param {string} htmlFile - Handlebars template file name (without extension).
 * @param {any} data - Additional data for handlebars template.
 */
const sendEmailWithoutAttachment = (userName, recipientEmail, subject, htmlFile, data) => {
  const mailOptions = {
    from: 'ilyes.leo.ch@gmail.com',
    to: recipientEmail,
    subject: subject,
    template: htmlFile, // Name of the HBS file without the extension
    context: { // Data to fill the placeholders
      userName: userName,
      date: new Date().toLocaleDateString(), // Formatted date
      data: data,
    },
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};


module.exports = {
  sendEmailWithAttachment,
  sendEmailWithoutAttachment
};
