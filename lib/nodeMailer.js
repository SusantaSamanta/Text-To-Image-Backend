import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    services: 'gmail',
    host: 'smtp.gmail.com',  //Required to avoid localhost errors
    secure: true,
    port: 465,
    auth: {
        user: process.env.GMAIL_FOR_MAIL_SEND,
        pass: process.env.GMAIL_PASS_FOR_SEND_MAIL,
    },
});

export const sendVerificationMail = async ({ to, subject, html }) => {
    try {
        const mailResponse = await transport.sendMail({
            from: `VISION BRUSH <${process.env.GMAIL_FOR_MAIL_SEND}>`,
            to,
            subject,
            html,
        });
        console.log('VERIFICATION EMAIL SENDED TO : ', mailResponse.accepted);
        return true;
    } catch (err) {
        console.log('Error to send', err);
        return false;
    }
}
