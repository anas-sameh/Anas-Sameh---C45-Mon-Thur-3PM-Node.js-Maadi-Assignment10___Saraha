import crypto from "node:crypto";
import { IV_LENGHT, SECRET_KEY } from "../../../config/env.services.js";

const algorithm = "aes-256-cbc";
const key = Buffer.from(SECRET_KEY, "hex");

function decrypt(cipherText) {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(cipherText.iv, "hex"));

  let decrypted = decipher.update(cipherText.value, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export default decrypt;
