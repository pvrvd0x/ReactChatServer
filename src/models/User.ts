import { Schema, model, Document } from "mongoose";
import { isEmail } from 'validator';

export interface IUser extends Document {
    email: string;
    avatar?: string;
    fullname: string;
    password: string;
    confirmed: boolean;
    confirm_hash?: string;
    last_seen: {
        type: Date,
        default: Date,
    };
}

const UserSchema = new Schema({
    email: {
        type: String,
        require: 'Email is required',
        validate: [isEmail, 'Invalid email'],
        unique: true,
    },
    avatar: String,
    fullname: {
        type: String,
        required: 'Name is required',
    },
    password: {
        type: String,
        required: 'Password is required',
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    confirm_hash: String,
    last_seen: {
        type: Date,
        default: new Date(),
    },
}, {
    timestamps: true,
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;