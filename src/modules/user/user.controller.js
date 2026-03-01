import Router from "express"
import { profile, rotate } from "./user.services.js";
import {  authenticationProfile, secureRotate } from "../../middleware/index.js";
import { authorizedEndPoint } from "./user.authorized.endpoint.js";
const router = Router()


router.get("/", authenticationProfile() , async (req, res , next ) => {
    const result = await profile(req.user);
    return res.status(200).json({message:"profile retrieved successfully" , result})
});
router.get("/rotate",secureRotate(authorizedEndPoint.Admin) , async (req, res , next ) => {
    const result = await rotate(req.token);
    return res.status(200).json({message:"token rotated successfully" , result})
});


export default router