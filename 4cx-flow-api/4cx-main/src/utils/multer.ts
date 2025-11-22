import multer, { diskStorage, Multer } from 'multer';
import { extname } from 'path';
import fs from 'fs';

export default class MulterFileUploader {

    constructor(private uploadDir?: string,) {
        this.uploadDir = uploadDir ;
    }

    public upload : Multer =  multer({
            storage: diskStorage({
                destination: (req, file, callback) => {
                    try {
                        const currentDate = new Date();
                        const year = currentDate.getFullYear();
                        const month = currentDate.getMonth() + 1; // Months are zero-indexed
                        const day = currentDate.getDate();
                        const uploadPath = `${this.uploadDir}`;
                        fs.mkdirSync(uploadPath, { recursive: true });
                        callback(null, uploadPath);    
                    } catch (error) {
                        return
                    }
                },
                filename: (req, file, callback) => {
                    const randomName = Array(16)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join("");
                    callback(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        });
}