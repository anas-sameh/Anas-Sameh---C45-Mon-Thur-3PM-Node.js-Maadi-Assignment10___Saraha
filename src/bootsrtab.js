import express from "express"
import { authRouter } from "./modules/index.js"
import { PORT } from "../config/env.services.js"
import {connectDB} from "./DB/index.js"
async function bootstrap() {

// DB

await connectDB()

// express
const app = express()
const port = PORT 

app.listen(port , ()=>{console.log(`server is running on port --> ${port}`);})


// routing 
app.use(express.json());


app.get("/" , (req, res, next )=>{
    return res.status(200).json({message:"hello Home page"})
})

// auth router 
app.use("/auth", authRouter);




// error handling  
app.use((err, req,res,next)=>{
    const status = err?.cause?.status || 500;
    return res.status(status).json({message:err.message} || {message:"Internal server error" ,  stack : err.stack})
})

// handle invaild routing 
app.all("{/dummy}" , (req, res, next)=>{
    return res.status(404).json({message:"page not found"})
})



}


export default bootstrap