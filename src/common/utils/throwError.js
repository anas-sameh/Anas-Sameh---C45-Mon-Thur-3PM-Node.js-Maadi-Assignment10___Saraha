export default function throwError(message, statusCode= 500, extra = {}) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.extra = extra;
  throw error;
}