import joi from"joi";

export const validationAuthScema = {
//email validation
email:joi.string().email({minDomainSegments:2 ,maxDomainSegments:3}).pattern(new RegExp(/@(gmail|yahoo|icloud)\.(com|net)$/))
.messages({"string.pattern.base":"email must be a valid email address from gmail, yahoo, or icloud domains"}),
//pass validation
password:joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,30}$/)
.messages({"string.pattern.base":"password must be 8-30 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character"}),
//confirmPassword validation
confirmPassword:function(match="password"){return joi.string().valid(joi.ref(match))
.messages({"any.only":"confirm password must match password"})},
//name validation
name:joi.string().min(3).messages({"string.min":"name must be at least 3 characters"}), 
//phone validation
phone:joi.string().pattern(/^(002|\+2)?(01)(1|0|2|5)\d{8}$/)
.messages({"string.pattern.base":"phone number must be a valid Egyptian phone number"}),
//age validation
age:joi.number().min(18).max(100).integer().positive( ),
//address validation
address:joi.string().min(5),
//gender validation
gender:joi.string().valid(0, 1).default(0),
//Role validation
Role:joi.string().valid(0, 1).default(0)
}