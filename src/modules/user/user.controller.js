import Router from "express"
import { profile } from "./user.services.js";
const router = Router()

router.get("/", async (req, res , next ) => {
    const result = await profile(req.headers.authorization);
    return res.status(200).json({message:"profile retrieved successfully" , result})
});

export default router