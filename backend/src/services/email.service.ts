import transporter from "../configs/nodemaller.config";
import { NotFoundError } from "../core/error.response";
import { IOtp, IEmail } from "../interface/interface";
import { replacePlaceHolder } from "../utils";
import htmlEmailToken from "../utils/template/tem.html";
import otpService from "./otp.service";
import templateService from "./template.service";

const sendEmailLinkVerify = async ({
  html,
  toEmail,
  subject,
  text,
}: IEmail) => {
  try {
    const mailOptions = {
      from: ' "SHOPRS"  <bbotshoprs3110@gmail.com> ',
      to: toEmail,
      subject,
      html,
      text,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
      }

      console.log("Message sent::", info?.messageId);
    });
  } catch (error) {
    console.error("error to send mail", error);
    return error;
  }
};

class EmailService {
  async sendEmailToken({ email }: IOtp) {
    try {
      // 1. get token
      const token = await otpService.newOtp({ email });

      // 2. get templates
      const foundTemplate = await templateService.getTemplate({
        name: "HTML EMAIL TOKEN",
      });

      if (!foundTemplate) {
        throw new NotFoundError("Template not found");
      }

      //3. replace placeholder with params
      const content = replacePlaceHolder({
        template: foundTemplate.tem_html ?? "",
        params: {
          link_verify: `http:localhost:3056/cpg/welcome-back?token=${token.otp_token}`,
        },
      });

      // 4. send mail
      await sendEmailLinkVerify({
        html: content || "",
        toEmail: email,
        subject: "please confirm your registered email address~~~~!!!",
      });
    } catch (error) {
      console.error(error);
    }
  }
}

const emailService = new EmailService();

export default emailService;
