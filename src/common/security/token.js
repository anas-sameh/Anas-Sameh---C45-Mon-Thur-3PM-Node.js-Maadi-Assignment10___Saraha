import jwt from "jsonwebtoken";
import throwError from "../utils/throwError.js";
import { JWT_EXPIRE_TIME, JWT_SECRET_GOOGLE, JWT_SECRET_System, Refresh_EXPIRE_TIME, Refresh_token_GOOGLE, Refresh_token_System } from "../../../config/env.services.js";
import { findById } from "../../DB/database.repository.js";
import { UserModel } from "../../DB/index.js";
import {randomUUID} from "node:crypto";
import { deleteKey, exist, get, logoutAllKey, revokedSessionKey } from "../services/redis.services.js";

export const createToken = async ({payload={}, secret , options ={}}= {}) => {
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
export async function createLoginCredentials(user , accessSecret, refreshSecret) {
const jwtid = randomUUID()
const sessionId = randomUUID()
const accessToken = await createToken(
    { payload: { sub: user._id, provider: user.provider ,type: "accessToken" ,sessionId}, secret: accessSecret, options: { expiresIn: JWT_EXPIRE_TIME , jwtid  } }
);

const refreshToken = await createToken(
  { payload: { sub: user._id, provider: user.provider ,type: "refreshToken" ,sessionId}, secret: refreshSecret, options: { expiresIn: Refresh_EXPIRE_TIME , jwtid }  }
);

return { accessToken, refreshToken };
}



// verify token and return user data + decoded payload
export const tokenValidation = async (token, expectedType) => {

  // decode token without verifying signature
  const decoded = decodeToken(token);

  if (!decoded || !decoded.type || decoded.provider === undefined) {
    throwError("Invalid token format", 401);
  }

  if (decoded.type !== expectedType) {
    throwError("Invalid token type", 401);
  }

  // get provider secrets
  const { refreshSecret, accessSecret } = await getProviderSegneture({
    user: decoded,
    secrets: {
      Refresh_token_System,
      Refresh_token_GOOGLE,
      JWT_SECRET_System,
      JWT_SECRET_GOOGLE
    }
  });

  let verify;

  // =========================
  // ACCESS TOKEN FLOW
  // =========================
  if (decoded.type === "accessToken") {

    try {
      verify = verifyToken(token, accessSecret);
    } catch (err) {
      throwError("Invalid token", 401);
    }

    const userData = await findById({
      model: UserModel,
      id: verify.sub
    });

    if (!userData) {
      throwError("User not found", 404);
    }

    // ===== check logout device =====
    const revokeSessionKeyData = revokedSessionKey({
      sid: verify.sessionId
    });

    if (await exist({ key: revokeSessionKeyData })) {
      throwError("Invalid login session", 400);
    }

    // ===== check logout all =====
    const logoutAllKeyData = logoutAllKey({
      sub: verify.sub
    });

    const logoutAllTs = await get({ key: logoutAllKeyData });

    if (logoutAllTs && verify.iat < Number(logoutAllTs)) {
      throwError("Invalid login session", 400);
    }

    return { userData, verify };
  }

  // =========================
  // REFRESH TOKEN FLOW
  // =========================
  else if (decoded.type === "refreshToken") {

    try {

      verify = verifyToken(token, refreshSecret);

      const userData = await findById({
        model: UserModel,
        id: verify.sub
      });

      if (!userData) {
        throwError("User not found", 404);
      }

      // ===== check logout device =====
      const revokeSessionKeyData = revokedSessionKey({
        sid: verify.sessionId
      });
      const revokedSession = await exist({ key: revokeSessionKeyData })
      if (revokedSession) {
        throwError("Invalid login session", 400)
        }

      // ===== check logout all =====
      const logoutAllKeyData = logoutAllKey({
        sub: verify.sub
      });

      const logoutAllTs = await get({ key: logoutAllKeyData });

      if (logoutAllTs && verify.iat < Number(logoutAllTs)) {
        throwError("Invalid login session", 400);
      }

      // ===== prevent refresh if access still valid =====
     // check if access expired
      const accessExpired = verify.exp * 1000 <= Date.now()

      if (!accessExpired) {
        throwError("access token still valid", 400)
      }

      // ===== create new access token =====
      const newAccessToken = await createToken({
        payload: {
          sub: verify.sub,
          provider: userData.provider,
          type: "accessToken",
          sessionId: verify.sessionId
        },
        secret: accessSecret,
        options: {
          expiresIn: JWT_EXPIRE_TIME,
          jwtid: randomUUID()
        }
      });
      

      return {
        userData,
        accessToken: newAccessToken,
        verify
      };

    } catch (err) {

      if (err.statusCode) {
        throw err;
      }

      throwError("Invalid token", 401);
    }
  }
};