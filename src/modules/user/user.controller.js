import Router from "express"
import { emailConfirm, profile, rotate, sendEmailVerify } from "./user.services.js";
import {  authenticationProfile, secureRotate } from "../../middleware/index.js";
import { authorizedEndPoint } from "./user.authorized.endpoint.js";
import { emailConfirmSchema } from "./auth.validation.js";
import { validationMiddleware } from "../../middleware/vaildation.middleware.js";
const router = Router()


router.get("/", authenticationProfile() , async (req, res , next ) => {
    const result = await profile(req.user);
    return res.status(200).json({message:"profile retrieved successfully" , result})
});
router.get("/rotate",secureRotate(authorizedEndPoint.Admin) , async (req, res , next ) => {
    const result = await rotate(req.token);
    return res.status(200).json({message:"token rotated successfully" , result : {refreshToken:result}})
});

router.post("/sendEmail", authenticationProfile() , async (req, res , next ) => {
    const result = await sendEmailVerify(req.user);
    return res.status(200).json({message:"email sent successfully" , result})
});
router.post("/emailConfirm", authenticationProfile() ,validationMiddleware(emailConfirmSchema) , async (req, res , next ) => {
    const result = await emailConfirm(req.user,req.body.otp);
    return res.status(200).json({message:"email verified successfully" , result})
});


export default router