import multer from "multer";
const upload = multer({ dest: 'uploads/' });

import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    // Echos the file data
    const file = req.file;
    
    res.send(file);
}


export const multipartOptions = upload.single('fileKey');