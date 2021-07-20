const nodemailer = require("nodemailer");
const {NODEMAILER_PASSWORD, NODEMAILER_USER, NODEMAILER_HOST} = process.env 

const sendEmail = async (contentHTML, subject, to) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: NODEMAILER_HOST,
        auth: {
            user: NODEMAILER_USER,
            pass: NODEMAILER_PASSWORD
        },
    });


    let info = await transporter.sendMail({
        from: '"Avisame" <avisame@avisame.es>', // sender address,
        to: to,
        subject: subject,
        html: contentHTML
    });


    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    return;
}

module.exports = {sendEmail};