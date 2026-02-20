import bcrypt from "bcrypt";
import { SALT_ROUND } from "../../../config/env.services.js";

export async function hashing(password){
const hashedPass = bcrypt.hash(password, SALT_ROUND);
return hashedPass
}


export async function compare(password ,hashedPass){
const check = bcrypt.compare(password, hashedPass);
return check
}