import { NEXT_APP_CLIENT, SENDMAILPASSWORD, SENDMAILUSER } from "../config/index.js";
import nodemailder from "nodemailer";
import Mailgen from "mailgen";
import User from "../models/base/User.js";
import ResponseModel from "../models/response/ResponseModel.js";

const MailService = {
    async sendMailVerifyResetPassword(email, tokenForResetPassword) {
        const user = await User.findOne({ email: email });

        let config = {
            service: "gmail",
            auth: {
                user: SENDMAILUSER,
                pass: SENDMAILPASSWORD,
            },
        };

        let transporter = nodemailder.createTransport(config);

        let MailGenerator = new Mailgen({
            theme: "cerberus",
            product: {
                name: "Petournal",
                link: NEXT_APP_CLIENT,
            },
        });

        let response = {
            body: {
                name: user?.lastName + " " + user?.firstName,
                intro: "Welcome to Petournal! We're very excited to have you on board.",
                action: {
                    instructions: "To reset your password, please click here:",
                    button: {
                        color: "#7C3AED", // Optional action button color
                        text: "RESET YOUR PASSWORD",
                        link: NEXT_APP_CLIENT + "/reset-password?token=" + tokenForResetPassword,
                    },
                },
                outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
            },
        };

        let mail = MailGenerator.generate(response);

        let message = {
            from: SENDMAILUSER,
            to: email,
            subject: "Reset Password",
            html: mail,
        };

        const sendMail = await transporter.sendMail(message);
        if (sendMail) {
            return { msg: "Đã gửi mail, vui lòng kiểm tra email" };
        } else {
            throw new ResponseModel(500, ["Lỗi gửi mail"], null);
        }
    },
};

export default MailService;
