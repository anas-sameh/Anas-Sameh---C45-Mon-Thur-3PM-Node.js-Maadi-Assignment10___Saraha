import multer from 'multer';
import {resolve} from "node:path";
import {randomUUID} from "node:crypto"
import { existsSync, mkdirSync } from 'node:fs';
import { fileFilter } from './multer.validation.js';
export const localFileUpload = ({
    coustomPath = "genral",
    validation = {},
    maxSize = 5
}={})=>{

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const fullPath = resolve('./uploads',coustomPath)
            if(!existsSync(fullPath)){

                mkdirSync(fullPath,{recursive:true})
            }
            cb(null,fullPath)   
        },

        filename: function (req, file, cb) {
            const uniqueName = randomUUID() + '-' + file.originalname
            file.finalPath = `/uploads/${coustomPath}/${uniqueName}`
            
            cb(null, uniqueName)
        }
    });

    return multer({fileFilter: fileFilter(validation) ,storage , limits: {fileSize: maxSize * 1024 * 1024}})
}