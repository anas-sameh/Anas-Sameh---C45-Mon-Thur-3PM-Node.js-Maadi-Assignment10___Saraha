import joi from "joi";
import { fileFeildValidation, validationAuthScema } from "../../common/index.js";


export const profileImageSchema = {
  file: validationAuthScema.file(fileFeildValidation.image).required(),
};

export const coverImageSchema = {
  files: joi.array().items(
    validationAuthScema.file(fileFeildValidation.image).required()
  ).min(1).max(2).required()
}
