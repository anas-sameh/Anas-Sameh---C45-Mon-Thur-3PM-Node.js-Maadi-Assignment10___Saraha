import { createOne, findOne, UserModel } from "../../DB/index.js";
import { throwError } from "../../common/index.js";
import {encryptData , decryptData, hashing, compare, createToken, getProviderSegneture } from "../../common/security/index.js";;
import { JWT_SECRET_GOOGLE , JWT_SECRET_System, Refresh_token_GOOGLE, Refresh_token_System } from "../../../config/env.services.js";

export const signup = async (input) => {
  const { email, password, name, phone, age, address, gender } = input;

  // check if all data are exist (Backend validation layer1 befor DB)
  if (!email || !password || !name || !phone || !age || !address ) {
    throwError("All fields are required", 400);
  }

  // check user exist
  const getUsers = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (getUsers) {
    throwError("email is alredy exists", 409);
  }

  // Split the name
  const nameParts = name.trim().split(" ");
  input.firstName = nameParts[0];
  input.lastName = nameParts[nameParts.length - 1];

  delete input.name;

  // Hashing for password
  input.password = await hashing(password)
  // Encrypting phone
  input.phone = JSON.stringify(encryptData(phone));

  // store in DB

  const result = await createOne({
    model: UserModel,
    data: [input],
  });

  // const result = new UserModel(input);
  // await result.save()

  return result;
};

export const login = async (input ,issuer) => {
  const { email, password } = input;

  // validation (Backend validation layer1 befor DB)

  if (!email || !password) {
    throwError("All fields are required", 400);
  }

  // check email exist
  const user = await findOne({
    model: UserModel,
    filter: { email },
  });
  if (!user) {
    throwError("Invalid credentials", 401);
  }

  // check password
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    throwError("Invalid credentials", 401);
  }

  user.phone = decryptData(JSON.parse(user.phone));

  // TOKEN

const { accessSecret, refreshSecret } = await getProviderSegneture({
  user,
  secrets: {
    JWT_SECRET_System,
    JWT_SECRET_GOOGLE,
    Refresh_token_System,
    Refresh_token_GOOGLE
  }
});


const accessToken = createToken(
    { payload: { sub: user._id, provider: user.provider }, secret: accessSecret, options: { expiresIn: "15m" } }
);

const refreshToken = createToken(
  { payload: { sub: user._id, provider: user.provider }, secret: refreshSecret, options: { expiresIn: "1y" } }
);

  
return { accessToken ,refreshToken};
};
