import { JWT_SECRET } from "../../../config/env.services.js";
import { findById, UserModel } from "../../DB/index.js";
import { throwError } from "../../common/index.js";
import jwt from "jsonwebtoken";
export const profile = async (authorization) => {

  const verify = jwt.verify(authorization, JWT_SECRET);

  const user = await findById({ model: UserModel, id: verify.id });
  if (!user) {
    throwError("User not found", 404);
  }

  return user ;
};
