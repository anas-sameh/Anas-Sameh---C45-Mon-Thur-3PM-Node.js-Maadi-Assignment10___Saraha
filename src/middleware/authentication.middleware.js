import {tokenValidation,throwError} from "../common/index.js";

export  function authenticationMiddleware(tokenType = "accessToken") {
  return async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throwError("token header is missing", 401);
    }
    const {userData , verify}= await tokenValidation(token,tokenType);
    
    req.user = userData
    req.token = verify
    next();
  };
}

export  function authorization(roles = []) {

  return (req, res, next) => {

    if (!req.user || !req.user.Role) {
      return next(throwError("Unauthorized", 403));
    }

    if (roles !== req.user.Role ) {
      return next(throwError("Unauthorized access", 403));
    }

    next();
  };
}

export function secureRotate(roles = []) {

  //authenticationRotate 
  return async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throwError("token header is missing", 401);
    }
   const {accessToken, userData} = await tokenValidation(token ,"refreshToken");
   req.token = accessToken;
   req.user = userData;


  //authorization
  

    if (!req.user || req.user.Role ===undefined) {
      return next(throwError("Unauthorized", 403));
    }

    if (roles !== req.user.Role ) {
      return next(throwError("Unauthorized access", 403));
    }

    next();
  };
  
}

