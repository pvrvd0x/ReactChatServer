import { model, Schema, Document } from 'mongoose';

export interface IUploadedFile extends Document {
    filename: string,
    size: number,
    ext: string,
    message: string,
    user: string,
    url: string,
}

const UploadedFileSchema = new Schema({
    filename: String,
    size: Number,
    url: String,
    ext: String,
    message: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
}, {
    timestamps: true,
});

const UploadedFileModel = model<IUploadedFile>("UploadedFile", UploadedFileSchema);

export default UploadedFileModel;