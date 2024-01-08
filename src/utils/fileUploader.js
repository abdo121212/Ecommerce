import multer, { diskStorage } from "multer";
export const fliterObject = {
  image: ["image/jpg", "image/png" ,'image/jpg'],
  pdf: ["application/pdf"],
  video: ["video/mp4"],
};
export const fileUploader = (filterArray) => {
  const fileFilter = (req, file, cb) => {

    if (!filterArray.includes(file.mimetype)) {
      return cb(new Error("invalid file Format ", false));
    }
    return cb(null, true);
  };

  return multer({ storage: diskStorage({}), fileFilter });
};
