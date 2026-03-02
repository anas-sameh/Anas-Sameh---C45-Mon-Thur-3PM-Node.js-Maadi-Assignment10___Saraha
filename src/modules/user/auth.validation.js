import joi from"joi";

export const emailConfirmSchema = {
  body:joi.object({
  otp:joi.string().length(6).required(),
}).required()
}