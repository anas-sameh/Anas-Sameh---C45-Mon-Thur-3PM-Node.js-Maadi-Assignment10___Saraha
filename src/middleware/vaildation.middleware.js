import { throwError } from "../common/index.js";

export function validationMiddleware(schema) {
  return async (req, res, next) => {
    let errors = [];
    for (const key of Object.keys(schema) || []) {
    const validation = schema[key].validate(req[key], { abortEarly: false });

    if (validation.error) {
        errors.push(key ,...validation.error.details);
    }
    }
    if (errors.length > 0) {
        throwError("Validation error", 400, errors)
    }
    next();
  };      
}

