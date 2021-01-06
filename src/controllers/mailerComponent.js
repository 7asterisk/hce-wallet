const nodemailer = require("nodemailer");

import dotenv from 'dotenv';
dotenv.config();

export async function sendMail(email, body) {
    console.log(email, body);

    // create reusable transporter object using the default SMTP transport
    let transporter = await nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.emailId, // generated ethereal user
            pass: process.env.password, // generated ethereal password
        },
    });
    var mailOptions = {
        from: '"Learing Mengment 👻"', // sender address
        to: email, // list of receivers
        subject: "Hello", // Subject line
        html: `<B>Hello !<B> </br> <a href='${body}' >click to reset password</a>`, // html body
    }
    // send mail with defined transport object
    transporter.sendMail(mailOptions)
}