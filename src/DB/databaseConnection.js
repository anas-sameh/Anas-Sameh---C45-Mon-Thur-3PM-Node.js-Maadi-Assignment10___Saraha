import {mongoose} from "mongoose"
import {DB_HOST} from "../../config/env.services.js"
import { UserModel } from "./models/index.js"

export  const connectDB = async ()=>{
    try {
            await mongoose.connect(DB_HOST , {serverSelectionTimeoutMS: 5000})
            await UserModel.syncIndexes()
            console.log(`DB connected ✅`);
            
    } catch (error) {
        console.log(`failed to connect on DB ❌ ` , error);
        
    }
}

