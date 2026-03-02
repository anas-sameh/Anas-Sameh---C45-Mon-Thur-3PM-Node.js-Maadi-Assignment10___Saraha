import { createOne, findOne, UserModel } from "../../DB/index.js";
import { ProviderEnum, throwError } from "../../common/index.js";
import {encryptData , decryptData, hashing, compare, createToken, getProviderSegneture, createLoginCredentials, decodeToken } from "../../common/security/index.js";;
import { GOOGLE_CLIENT_ID, JWT_SECRET_GOOGLE , JWT_SECRET_System, Refresh_token_GOOGLE, Refresh_token_System } from "../../../config/env.services.js";
import {OAuth2Client} from 'google-auth-library';



export const signup = async (input) => {
  const { email, password, name, phone } = input;

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

  // check email exist
  const user = await findOne({
    model: UserModel,
    filter: { email },
  });
  if (!user) {
    throwError("Invalid credentials", 401);
  }

  // check password
  if (user.provider === ProviderEnum.System) {
      const isMatch = await compare(password, user.password);
  if (!isMatch) {
    throwError("Invalid credentials", 401);
  }
  }
if (user.phone) {
  user.phone = decryptData(JSON.parse(user.phone));
}

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

  
return await createLoginCredentials(user, accessSecret, refreshSecret);
};

export const signupWithGoogle = async ({idToken}) => {

const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
if (!payload?.email_verified) {
  throwError("Email is not verified", 400);
} 

const checkUserExist = await findOne({
    model: UserModel,
    filter: { email: payload.email },
  });
  
  if (checkUserExist?.provider === ProviderEnum.System) {
    throwError("account is already registered with system provider", 409);
  }else if (checkUserExist?.provider === ProviderEnum.Google) {
    return await login({ email: payload.email, password: null }, ProviderEnum.Google);
  }

  if (!checkUserExist) {
    const user = await createOne({
      model: UserModel,
      data: [{
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        provider: ProviderEnum.Google,
        profileImage: payload.picture,
        confirmEmail: new Date(),
        password: null
      }]
    });
    return await login({ email: user.email, password: null }, ProviderEnum.Google);
  }
}