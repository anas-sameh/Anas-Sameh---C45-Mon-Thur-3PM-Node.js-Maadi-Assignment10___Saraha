import {confirmEmailOtp,sendOtpToEmail,} from "../../common/index.js";

export const profile = async (user) => {
  return await user;
};

export const rotate = async (token) => {
  return await token;
};

export const sendEmailVerify = async (user) => {
    return await sendOtpToEmail(user);
}

export const emailConfirm = async (user, otp) => {

 return await confirmEmailOtp(user, otp);
};
