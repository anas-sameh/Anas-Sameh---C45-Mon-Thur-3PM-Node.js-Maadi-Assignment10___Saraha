import nodemailer from "nodemailer";
import throwError from "./throwError.js";
import { EMAIL_HOST, EMAIL_PASS } from "../../../config/env.services.js";

export default async function sendEmail({ to, subject, text }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_HOST,
        pass:EMAIL_PASS,
      },
    });
    
    
    await transporter.sendMail({
      from: EMAIL_HOST,
      to,
      subject,
      text,
    });

    return true;

  } catch (error) {
    throwError("Failed to send email " , 500 , error.message);
  }
}