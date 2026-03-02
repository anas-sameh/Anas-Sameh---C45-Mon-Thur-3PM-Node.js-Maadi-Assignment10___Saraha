import joi from"joi";
import { validationAuthScema } from "../../common/index.js";

export const loginSchema = {
  body:joi.object({
  email:validationAuthScema.email.required(),
  password:validationAuthScema.password.required(),
}).required()
}

export const signupSchema = {
body:loginSchema.body.append().keys({
  confirmPassword:validationAuthScema.confirmPassword("password").required(),
  name:validationAuthScema.name.required(),   
  phone:validationAuthScema.phone,
  age:validationAuthScema.age.required(),
  address:validationAuthScema.address,
  gender:validationAuthScema.gender.required(),
  Role:validationAuthScema.Role.required()
}).required(),

params:joi.object().keys({
  lang:joi.string().valid("ar","en").required()
}).required()
}


//   confirmEmail:joi.boolean().default(false).valid(true),
