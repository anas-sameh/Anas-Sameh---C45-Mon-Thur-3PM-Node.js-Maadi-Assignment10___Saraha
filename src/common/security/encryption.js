import crypto from "node:crypto";
import { IV_LENGHT, SECRET_KEY } from "../../../config/env.services.js";



function encrypt(text) {
  const iv = crypto.randomBytes(Number(IV_LENGHT));
  const algorithm = "aes-256-cbc";
  const key = Buffer.from(SECRET_KEY, "hex");
  

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    value: encrypted,
  };
}

export default encrypt;
