import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: 'slimchat90@gmail.com',
        pass: 'm4Frvi3dAkBxQYk'
    }
});

export default transporter;