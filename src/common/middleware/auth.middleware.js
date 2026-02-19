import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../../../config/env.services.js"
export const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(
      new Error("Token is required", { cause: { status: 401 } })
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(
      new Error("Invalid token format", { cause: { status: 401 } })
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (err) {
    return next(
      new Error("Invalid or expired token", { cause: { status: 401 } })
    );
  }
};