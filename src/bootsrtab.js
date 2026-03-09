import express from "express"
import { authRouter,userRouter } from "./modules/index.js"
import { PORT } from "../config/env.services.js"
import {connectDB} from "./DB/index.js"
import cors from "cors"
import {createRedisConnection} from "./DB/index.js"
async function bootstrap() {

// DB

await connectDB()
await createRedisConnection()
// express
const app = express()
const port = PORT 


// routing and middlewares

app.use(cors(),express.json());
app.use('/uploads', express.static('uploads'));

app.get("/" , (req, res, next )=>{
    return res.status(200).json({message:"hello Home page"})
})

// auth router 
app.use("/auth", authRouter);

app.use("/user", userRouter);


// error handling  
app.use((err, req,res,next)=>{
    const status = err.statusCode || 500;
    return res.status(status).json({message:err.message || "Internal server error", extra: err.extra || null, stack: err.stack || null})
})

// handle invaild routing 
app.all("{/dummy}" , (req, res, next)=>{
    return res.status(404).json({message:"page not found"})
})

app.listen(port , ()=>{console.log(`server is running on port --> ${port}`);})


}


export default bootstrap