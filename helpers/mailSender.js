require('dotenv').config();
const nodemailer =  require('nodemailer');
const xoauth2 = require('xoauth2')

const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

module.exports = { mailer };