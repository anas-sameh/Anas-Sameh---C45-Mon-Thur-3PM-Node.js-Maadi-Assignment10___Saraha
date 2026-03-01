import jwt from "jsonwebtoken";
import throwError from "../utils/throwError.js";
import { JWT_SECRET_GOOGLE, JWT_SECRET_System, Refresh_token_GOOGLE, Refresh_token_System } from "../../../config/env.services.js";
import { findById } from "../../DB/database.repository.js";
import { UserModel } from "../../DB/index.js";
import { decryptData } from "./index.js";

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


const accessToken = await createToken(
    { payload: { sub: user._id, provider: user.provider ,type: "accessToken" }, secret: accessSecret, options: { expiresIn: "1h" } }
);

const refreshToken = await createToken(
  { payload: { sub: user._id, provider: user.provider ,type: "refreshToken" }, secret: refreshSecret, options: { expiresIn: "1y" } }
);

return { accessToken, refreshToken };
}



export const segnitureLevel = async(token , expectedType) => {
  const decoded = decodeToken(token);  
if (!decoded ||!decoded.type ||decoded.provider === undefined) {
  throwError("Invalid token format", 401);
}

  if (decoded.type !== expectedType) {
    throwError("Invalid token type", 401);
  }

  const {refreshSecret , accessSecret} = await getProviderSegneture({user: decoded, secrets: {Refresh_token_System, Refresh_token_GOOGLE ,JWT_SECRET_System, JWT_SECRET_GOOGLE}});

  let verify;

  if (decoded.type === "accessToken") {
        try {
        verify = verifyToken(token, accessSecret);
      } catch (err) {
        throwError("Invalid token", 401);
      }
  
      const userData = await findById({ model: UserModel, id: verify.sub });
      if (!userData) {
        throwError("User not found", 404);
      }

      if (userData.phone) {
        userData.phone = decryptData(JSON.parse(userData.phone));
      }
  
      return userData
  }else if (decoded.type === "refreshToken") {

    try {
         verify = verifyToken(token, refreshSecret);

        const userData = await findById({ model: UserModel, id: verify.sub });
      if (!userData) {
        throwError("User not found", 404);
      } 
        const accessToken = await createToken({
          payload: { sub: verify.sub , type: "accessToken" , provider: decoded.provider},
          secret: accessSecret,
          options: {
            expiresIn: "1h",
          },
        });
        
    
        return {accessToken, userData};
      } catch (err) {
        throwError(`Invalid token ${err.message}`, 401);
      }
  }else {
    throwError("invalid token type" , 401)
  }

  
}