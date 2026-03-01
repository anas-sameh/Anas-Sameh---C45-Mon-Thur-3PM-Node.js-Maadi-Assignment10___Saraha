import {Router} from "express"
const router = Router()
import { login , signup, signupWithGoogle } from "./auth.services.js";


router.post("/signup", async (req, res , next ) => {
    const result = await signup(req.body);
    return res.status(200).json({message:"signup successful" , result})
});

router.post("/login",async (req, res , next ) => {    
    const result = await login(req.body , `${req.protocol}://${req.host}`);
    return res.status(200).json({message:"login successful" , result})
});

router.post("/signup/gmail", async (req, res , next ) => {
    const result = await signupWithGoogle(req.body, `${req.protocol}://${req.host}`);
    return res.status(201).json({message:"signup with gmail successful" , result})
});
         

export default router