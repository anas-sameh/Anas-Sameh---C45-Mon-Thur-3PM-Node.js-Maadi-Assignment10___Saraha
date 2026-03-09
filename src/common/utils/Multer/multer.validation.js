import throwError from "../throwError.js"

export const fileFeildValidation = {
    image:['image/jpg' , 'image/jpeg' ,'image/png'],
    video:['video/mp4']
}

export const fileFilter = (validation = [])=>{
    return function (req ,file,cb) {
        if (!validation.includes(file.mimetype)) {
            return cb(new Error("invaild file format" ,{cause:{status:400}}),false)
        }
        return cb(null , true)
    }
}