import {decryptData, logoutAllKey, LogoutEnum, revokedSessionKey, set, throwError,} from "../../common/index.js";
import {  updateOne } from "../../DB/database.repository.js";
import { UserModel } from "../../DB/index.js";

const createRevokeSession = async ({ sessionId, exp }) => {

  return await set({
    key: revokedSessionKey({ sid: sessionId }),
    value: sessionId,
    ttl: exp - Math.floor(Date.now() / 1000)
  })

}
const createLogoutAllData = async({exp,sub})=>{  
  return   await set({
        key : logoutAllKey({sub}),
        value:Math.floor(Date.now()/1000) ,
        ttl : exp - Math.floor(Date.now()/1000) ,
  }) 
}

export const profile = async (user) => {
 if (user.phone) {      
    user.phone = decryptData(JSON.parse(user.phone));
  }
   return await user;
};

export const rotate = async (token) => {  
  return await token;
};

export const profilePhoto = async (user, file) =>{  
  const updatedUser = await updateOne({
    model:UserModel,
    filter:{_id:user.id},
    data:{profileImage:file}
  })

  if (updatedUser.modifiedCount !== 1 ) {
    throwError("Failed to save profile image", 500);
  }
  
  return file;
};

export const coverImage = async (user, files) => {  
  const images = await files.map(file => file.finalPath);

  const updatedUser = await updateOne({
    model:UserModel,
    filter:{_id:user.id},
    data:{coverImage:images }
  })

  if (updatedUser.modifiedCount !== 1 ) {
    throwError("Failed to save profile image", 500);
  }
  
  return files;
};

//LOGOUT WITH REDIS
export const logout = async ({ sessionId, exp, sub }, flag) => {
  let status = 200;

  switch (flag) {

    case LogoutEnum.All:
      const logoutAll = await createLogoutAllData({ exp, sub });

      if (logoutAll === null) {
        throwError("invalid login session", 400);
      }

      break;

    default:
      const revokeSession = await createRevokeSession({
        sessionId,
        exp
      });

      if (revokeSession === null) {
        throwError("invalid login session", 400);
      }

      status = 201;
      break;
  }

  return status;
};

//LOGOUT WITH STORING TOKENS ON DB
// export const logout= async ({jti ,iat ,sub} , flag )=>{
//   let status =200
  
//   switch (flag) {
//     case LogoutEnum.All:
//         // user.changeCredantials = new Date()
//         // await user.save()
//         // await deleteMany({model : TokenModel , filter:{userId:user._id}})
//         // return status
//         break;

//     default:
      
//       // await createOne({
//       //     model: TokenModel ,
//       //     data :{userId: user._id,
//       //     jti : jti ,
//       //     expiresIn: iat + JWT_EXPIRE_TIME
//       //     },
//       //   })
//       //   status =201
//       break;
//   }

//   return status
// }
