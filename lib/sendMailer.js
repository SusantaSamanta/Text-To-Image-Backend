import axios from "axios";

const emailSendUrl = process.env.SENDMAILURL;

export const sendEmail = async (to, subject, html) => {
    console.log("Sending email to :", to);
    try {
        const res = await axios.post(
            emailSendUrl,
            {
                to,
                subject,
                html,
                admin: process.env.SENDMAILADMINPASSWORD,
            },
            { timeout: 10000 }
        );

        if (res.status < 200 || res.status >= 300) {
            console.log("Email service returned:", res.status);
            return false;
        }

        console.log("Email sent to :", to);
        return true;
    } catch (error) {
        console.log("Failed to send email :", to, error.message);
        return false;
    }
};