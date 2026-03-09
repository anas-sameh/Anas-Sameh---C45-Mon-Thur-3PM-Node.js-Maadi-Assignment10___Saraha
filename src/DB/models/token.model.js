import mongoose from "mongoose"


export const TokenSchema = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId , ref :"User" , required:true},
    jti :{type:String , required:true},
    expiresIn:{type:Date , required: true}
},{
    timestamps:true
})

TokenSchema.index({ expiresIn: 1 }, { expireAfterSeconds: 0 })
export const TokenModel = mongoose.models.Token || mongoose.model("Token", TokenSchema)
