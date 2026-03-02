import {
  decryptData,
  encryptData,
  sendToEmail,
  throwError,
} from "../../common/index.js";
import {  findOne, updateOne } from "../../DB/database.repository.js";
import { UserModel } from "../../DB/index.js";
import crypto from "crypto"; 


export const sendOtpToEmail = async (user) => {
 try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpEncrypt = JSON.stringify(encryptData(otp));
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

    const updatedUser = await updateOne({
      model: UserModel,
      filter: { _id: user._id },
      data: { otp: otpEncrypt, otpExpiration },
    });

    if (!updatedUser) {
      throwError("User not found", 404);
    }

    await sendToEmail({
      to: user.email,
      subject: "Email verification",
      text: otp,
    });

    return true;

  } catch (error) {
    throwError("Failed to send verification email", 500, error);
  } 
};


export const confirmEmailOtp = async (user, otp) => {

  const userFromDB = await findOne({
  model: UserModel,
  filter: { _id: user._id },
});

if (!userFromDB) {
  throwError("User not found", 404);
}

 if (userFromDB.confirmEmail === true) {
    throwError("Email is already verified", 400);
  }

if (!userFromDB.otp || !userFromDB.otpExpiration) {
  throwError("OTP expired", 400);
}
if (userFromDB.otpExpiration < Date.now()) {
  throwError("OTP expired", 400);
}
  
if (otp !== decryptData(JSON.parse(userFromDB.otp))) {
    throwError("invalid otp", 401);
}
  // update on DB

  try {
    const dataUpdate = await updateOne({
      model: UserModel,
      filter: { _id: userFromDB._id },
      data: { confirmEmail: true , otp: null , otpExpiration : null},
    });
 

    return dataUpdate;
  } catch (error) {
    throwError("verification failed (DB)", 400);
  }
}
