import { createOne, findOne, UserModel } from "../../DB/index.js";
import { throwError } from "../../common/index.js";
import {encryptData , decryptData, hashing, compare } from "../../common/security/index.js";;
import { JWT_SECRET } from "../../../config/env.services.js";
import jwt from "jsonwebtoken";

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

export const login = async (input) => {
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

    const accessToken = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { notBefore: "20s" }
    
    );
  
    return { user, accessToken };
};
