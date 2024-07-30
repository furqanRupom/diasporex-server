import nodemailer from "nodemailer";
import { config } from "../config";

const EmailSender = async (email: string, resetPassLink: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: config.app_email,
                pass: config.app_pass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const htmlContent = ` <html>
        <body>
         <p>You have requested to reset your password. Please click the link below to set a new password:</p>
          <a href="${resetPassLink}">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
          <p>Thank you,</p>
          <p>DiasporeX Support Team</p>
        </body>
      </html>`

        const info = await transporter.sendMail({
            from: '"DiasporeX Support" <support@diasporex.com>',
            to: email,
            subject: "DiasporeX - Reset Your Password",
            text: "You have requested to reset your password. Please use the link below to set a new password.",
            html: htmlContent
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default EmailSender;
