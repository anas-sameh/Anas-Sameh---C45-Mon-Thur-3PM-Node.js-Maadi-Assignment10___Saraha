import Router from "express"
import { coverImage, logout, profile, profilePhoto, rotate } from "./user.services.js";
import {  authenticationMiddleware, secureRotate } from "../../middleware/index.js";
import { authorizedEndPoint } from "./user.authorized.endpoint.js";
import { coverImageSchema, profileImageSchema } from "./user.validation.js";
import { validationMiddleware } from "../../middleware/index.js";
import { fileFeildValidation, localFileUpload } from "../../common/index.js";
const router = Router()

router.get("/", authenticationMiddleware() , async (req, res , next ) => {
    const result = await profile(req.user);
    return res.status(200).json({message:"profile retrieved successfully" , result})
});

router.post("/logout", authenticationMiddleware() , async (req, res , next ) => {
    const result = await logout(req.token , req.body.flag);
    return res.status(200).json({message:"logedout successfully" , result})
});

router.get("/rotate",secureRotate(authorizedEndPoint.Admin) , async (req, res , next ) => {
    const result = await rotate(req.token );
    return res.status(200).json({message:"token rotated successfully" , result : {refreshToken:result}})
});

router.patch("/photo-upload"  ,authenticationMiddleware(),
localFileUpload({ coustomPath: "user/profile-photos" , validation : fileFeildValidation.image
, maxSize:1 }).single('attachment'),
validationMiddleware(profileImageSchema),
 async (req, res , next ) => {
    const result = await profilePhoto(req.user ,req.file.finalPath);
    return res.status(200).json({message:"profile photo uploaded successfully" , result :result   })
});

router.patch("/cover-photo-upload"  ,authenticationMiddleware(),
localFileUpload({ coustomPath: "user/cover-photos" , validation : fileFeildValidation.image
, maxSize: 5 }).array('attachments', 2),
validationMiddleware(coverImageSchema),
async (req, res , next ) => {
    const result = await coverImage(req.user,req.files);
    return res.status(200).json({message:"profile photo uploaded successfully" , result :result   })
});

export default router