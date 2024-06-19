// import path from "path";

import multer, { diskStorage } from "multer";

// const upload = multer({
//   dest: "uploads/",
//   limits: { fileSize: 200 * 1024 * 1024 }, // 200 mb in size max limit
//   storage: diskStorage({
//     destination: "uploads/",
//     filename: (_req, file, cb) => {
//       cb(null, file.originalname);
//     },
//   }),

//   fileFilter: (_req, file, cb) => {
//     let ext = path.extname(file.originalname);
//     console.log(`file.originalname => ${file.originalname}`);

//     if (
//       ext !== ".jpg" &&
//       ext !== ".jpeg" &&
//       ext !== ".webp" &&
//       ext !== ".png" &&
//       ext !== ".mp4"
//     ) {
//       cb(new Error(`Unsupported file type! ${ext}`), false);
//       return;
//     }

//     cb(null, true);
//   },
// });

// export default upload;

// multer configuration
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/"); // Specify the destination folder for storing uploads
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname); // Use the original filename for the uploaded file
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // Limit file size to 200 MB
  fileFilter: function (_req, file, cb) {
    // Define file filter (allow only specific file types)
    const allowedFileTypes = ["image/jpeg", "image/png", "video/mp4"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Supported types: JPEG, PNG, MP4."),
        false
      );
    }
  },
});

export default upload;
