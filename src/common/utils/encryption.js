import crypto from "crypto";
import { SECRET_KEY } from "../../../config/env.services.js";

const algorithm = "aes-256-cbc";

const key = Buffer.from(SECRET_KEY, "hex");

function encrypt(text) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    value: encrypted,
  };
}

export default encrypt;
