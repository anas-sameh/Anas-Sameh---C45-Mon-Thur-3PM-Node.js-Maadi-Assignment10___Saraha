import express from "express"
import { authRouter,userRouter } from "./modules/index.js"
import { PORT } from "../config/env.services.js"
import {connectDB} from "./DB/index.js"
import cors from "cors"
async function bootstrap() {

// DB

await connectDB()

// express
const app = express()
const port = PORT 

app.listen(port , ()=>{console.log(`server is running on port --> ${port}`);})


// routing and middlewares

app.use(cors(),express.json());


app.get("/" , (req, res, next )=>{
    return res.status(200).json({message:"hello Home page"})
})

// auth router 
app.use("/auth", authRouter);

app.use("/user", userRouter);


// error handling  
app.use((err, req,res,next)=>{
    const status = err.statusCode || 500;
    return res.status(status).json({message:err.message} || {message:"Internal server error" ,  stack : err.stack})
})

// handle invaild routing 
app.all("{/dummy}" , (req, res, next)=>{
    return res.status(404).json({message:"page not found"})
})



}


export default bootstrap