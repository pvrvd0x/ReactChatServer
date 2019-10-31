import { Request, Response } from 'express';

import cloudinary from '../core/cloudinary';
import { UploadedFileModel } from "../models";

class UploadFileController {
    public create = (req: any, res: Response) => {
        const file = req.file;
        const userId = req.user._id;

        cloudinary.v2.uploader
            .upload_stream({ resource_type: 'auto' }, (err: any, result: any) => {
                if (err) {
                    throw new Error(err);
                }

                const fileData = {
                    filename: result.original_filename,
                    size: result.bytes,
                    ext: result.format,
                    url: result.url,
                    user: userId,
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
            })
            .end(file.buffer);
    };

    public delete = (req: Request, res: Response) => {}
}

export default UploadFileController;