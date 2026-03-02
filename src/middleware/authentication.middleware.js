import {segnitureLevel,throwError} from "../common/index.js";

export  function authenticationProfile() {
  return async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throwError("token header is missing", 401);
    }
    req.user = await segnitureLevel(token,"accessToken");
    next();
  };
}

export  function authenticationRotate() {
  return async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throwError("token header is missing", 401);
    }
   const {accessToken, userData} = await segnitureLevel(token ,"refreshToken");
   req.token = accessToken;
   req.user = userData;
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
   const {accessToken, userData} = await segnitureLevel(token ,"refreshToken");
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

