import { createOne, findOne, UserModel}  from "../../DB/index.js"
import {JWT_SECRET, SALT_ROUND} from "../../../config/env.services.js"
import {throwError} from "../../common/index.js"
import {encryptData}  from "../../common/index.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export const signup = async (input)=>{

  const {email , password , name , phone , age  , address  , gender} = input

  // check if all data are exist (Backend validation layer1 befor DB)
  if (!email || !password || !name || !phone || !age || !address || !gender) {
    throwError("All fields are required", 400);
  }

  // check user exist 
  const getUsers = await findOne({
    model: UserModel,
    filter:{email}
  });

  if(getUsers){
  
    throwError("email is alredy exists", 409);

    }
   
    // Split the name 
  const nameParts = name.trim().split(" ");
  input.firstName = nameParts[0];
  input.lastName = nameParts[nameParts.length - 1];


  delete input.name;

    // Hashing for password 
    input.password = await bcrypt.hash(password, SALT_ROUND);
    // Encrypting phone
    input.phone = JSON.stringify(encryptData(phone));

    // store in DB

      const result = await createOne({
      model: UserModel,
      data: [input]
    }); 
      
    // const result = new UserModel(input);
    // await result.save()

return result
}



export const login = async (input)=>{
  const {email ,password } = input

  // validation (Backend validation layer1 befor DB)

  if (!email || !password) {
    throwError("All fields are required", 400);
  };
  
  // check email exist
  const user = await findOne({
    model: UserModel,
    filter:{email}
  });
   if (!user) {
    throwError("Invalid credentials", 401);
  }

  // check password 
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throwError("Invalid credentials", 401);
  } 

  // generate JWT token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET , { expiresIn: "1h" });

  return {token}
}