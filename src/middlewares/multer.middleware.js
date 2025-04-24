import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) { //File option we only get because we are using multer. 
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  })
  
export const upload = multer({ 
    storage, 
})