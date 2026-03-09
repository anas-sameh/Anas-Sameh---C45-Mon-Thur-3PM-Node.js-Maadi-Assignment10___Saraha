import {Router} from "express"
const router = Router()
import { emailConfirm, login , sendEmailVerify, signup, signupWithGoogle } from "./auth.services.js";
import { emailConfirmSchema, loginSchema, signupSchema } from "./auth.validation.js";
import { validationMiddleware } from "../../middleware/vaildation.middleware.js";



router.post("/signup/:lang",validationMiddleware(signupSchema),async (req, res , next ) => {  
    const result = await signup(req.body);
    await sendEmailVerify(result)
    return res.status(200).json({message:"signup successful" , result})
});

router.post("/login",validationMiddleware(loginSchema),async (req, res , next ) => {    
    const result = await login(req.body , `${req.protocol}://${req.host}`);
    return res.status(200).json({message:"login successful" , result })
});
router.post("/emailConfirm" ,validationMiddleware(emailConfirmSchema) , async (req, res , next ) => {
    const result = await emailConfirm(req.body.id,req.body.otp);
    return res.status(200).json({message:"email verified successfully" , result})
});

router.post("/signup/gmail", async (req, res , next ) => {
    const result = await signupWithGoogle(req.body, `${req.protocol}://${req.host}`);
    return res.status(201).json({message:"signup with gmail successful , check ur email to verify it" , result})
});
         

export default router