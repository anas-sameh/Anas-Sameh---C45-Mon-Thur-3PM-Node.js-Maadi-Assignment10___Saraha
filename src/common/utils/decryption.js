import crypto from "crypto";
import { SECRET_KEY } from "../../../config/env.services.js";

const algorithm = "aes-256-cbc";
const key = Buffer.from(SECRET_KEY, "hex");

function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(encryptedData.iv, "hex"),
  );

  let decrypted = decipher.update(encryptedData.value, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export default decrypt;
