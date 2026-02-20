import { JWT_SECRET_System , JWT_SECRET_GOOGLE, JWT_SECRET_RotateToken, Refresh_token_GOOGLE, Refresh_token_System } from "../../../config/env.services.js";
import { findById, UserModel } from "../../DB/index.js";
import { throwError } from "../../common/index.js";
import jwt from "jsonwebtoken";
export const profile = async (authorization) => {
  let segneture
  const decoded = jwt.decode(authorization)  

  if(decoded.aud === "System"){
     segneture = JWT_SECRET_System
  } else if(decoded.aud === "Google"){
     segneture = JWT_SECRET_GOOGLE
  } else {
    throwError("Invalid token audience", 401);
  }

  try {
    const decoded = jwt.verify(authorization, segneture);

    const user = await findById({ model: UserModel, id: decoded.sub });
    if (!user) {
      throwError("User not found", 404);
    }

    return user;

  } catch (err) {
    throwError("Invalid token", 401);
  }
};

export const rotate = async (authorization) => {
   let segneture
  const decoded = jwt.decode(authorization)  

  if(decoded.aud === "System"){
     segneture = Refresh_token_System
  } else if(decoded.aud === "Google"){
     segneture = Refresh_token_GOOGLE
  } else {
    throwError("Invalid token audience", 401);
  }
  try {
      const verify = jwt.verify(authorization, segneture);
      
      const accessToken = jwt.sign({ sub: decoded.sub },segneture,{
        expiresIn: "1y"
      });
  
      

    return accessToken;

  } catch (err) {
    throwError(`Invalid token ${err.message}`, 401);
  }
};