import multer from "multer";
import { Request,Express } from "express";

// type RequestWithFile = Request & { file: multer.File };

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "uploads");
  },

  
  filename: (
    req: Request,
    
    file,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, file.originalname);
  },
 
});


const uploader = multer({
  storage: storage,
}).single("image");

export default uploader;



