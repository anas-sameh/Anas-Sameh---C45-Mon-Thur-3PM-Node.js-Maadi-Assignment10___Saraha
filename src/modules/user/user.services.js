import {JWT_SECRET_System,JWT_SECRET_GOOGLE,Refresh_token_GOOGLE,Refresh_token_System,} from "../../../config/env.services.js";
import { findById, UserModel } from "../../DB/index.js";
import {createToken,decodeToken,getProviderSegneture,throwError,verifyToken,} from "../../common/index.js";
 
export const profile = async (authorization) => {
  const user =  decodeToken(authorization);

const { accessSecret } = await getProviderSegneture({
  user,
  secrets: {
    JWT_SECRET_System,
    JWT_SECRET_GOOGLE,
  }
});

console.log(accessSecret); //00e12kjmcvvdpv14a58802deaclkcdnfon46rogjrfojj_system


  try {
    const verify = verifyToken(authorization, accessSecret);

    const user = await findById({ model: UserModel, id: verify.sub });
    if (!user) {
      throwError("User not found", 404);
    }

    return user;
  } catch (err) {
    throwError("Invalid token", 401);
  }
};

export const rotate = async (authorization) => {
  const decoded =  decodeToken(authorization);
  
  const {refreshSecret , accessSecret} = await getProviderSegneture({user: decoded, secrets: {Refresh_token_System, Refresh_token_GOOGLE ,JWT_SECRET_System, JWT_SECRET_GOOGLE}});
  
  try {
    const verify = verifyToken(authorization, refreshSecret);

    const accessToken = createToken({
      payload: { sub: verify.sub },
      secret: accessSecret,
      options: {
        expiresIn: "1y",
      },
    });

    return accessToken;
  } catch (err) {
    throwError(`Invalid token ${err.message}`, 401);
  }
};
