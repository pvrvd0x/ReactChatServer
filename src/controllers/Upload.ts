import { Request, Response } from 'express';

import { UploadedFileModel } from "../models";

class UploadFileController {
    public create = (req: any, res: Response) => {
        const file = req.file;
        const userId = req.user._id;

        const fileData = {
            filename: file.originalname,
            size: file.bytes,
            ext: file.format,
            url: file.url,
            user: userId
        };

        const uploadedFile = new UploadedFileModel(fileData);

        uploadedFile
            .save()
            .then((fileObj: any) => {
                res.json({
                    status: 'success',
                    file: fileObj
                })
            })
            .catch(err => {
                res.json({
                    status: 'error',
                    message: err
                })
            });
    };

    // public delete = (req: Request, res: Response) => {}
}

export default UploadFileController;