// Multer is a middleware for Express.js used for handling
// Why Do We Need Multer?

// By default, Express cannot handle file uploads.


// Multer supports two main storage types

// Disk Storage


//  Memory Storage



// Multer Configuration

// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
// });

// export default upload;

// In your route file, you can use the upload middleware to handle file uploads:

// router.post(
//   "/upload",
//   upload.single("image"),
//   uploadController
// );