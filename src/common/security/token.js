import jwt from "jsonwebtoken";
import throwError from "../utils/throwError.js";

export const createToken = ({payload={}, secret , options ={}}= {}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throwError("Invalid or expired token", 401);
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};


export async function getProviderSegneture({ user, secrets }) {

  if (!user || user.provider === undefined) {
    throwError("Invalid user provider", 400);
  }

  if (user.provider == 0) {
    return {
      accessSecret: secrets.JWT_SECRET_System ,
      refreshSecret: secrets.Refresh_token_System
    };
  }

  if (user.provider == 1) {
    return {
      accessSecret: secrets.JWT_SECRET_GOOGLE,
      refreshSecret: secrets.Refresh_token_GOOGLE
    };
  }

  throwError("Invalid user provider", 400);
}