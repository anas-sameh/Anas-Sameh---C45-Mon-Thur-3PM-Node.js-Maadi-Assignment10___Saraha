import {Router} from "express"
const router = Router()
import { login , signup } from "./auth.services.js";


router.post("/signup", async (req, res , next ) => {
    const result = await signup(req.body);
    return res.status(200).json({message:"signup successful" , result})
});

router.post("/login",async (req, res , next ) => {
    const result = await login(req.body);
    return res.status(200).json({message:"login successful" , result})
});

         

export default router