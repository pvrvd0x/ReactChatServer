import { Schema, model, Document } from "mongoose";
import { isEmail } from 'validator';
import { NextFunction } from "express";
import { generateUserPassword } from "../utils";


export interface IUser extends Document{
    email: string;
    avatar?: string;
    fullname: string;
    password: string;
    confirmed?: boolean;
    confirm_hash?: string;
    last_seen?: {
        type: Date,
        default: Date,
    };
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: 'Email is required',
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

UserSchema.pre('save', function(next: NextFunction) {
    const user: any = this;

    if (!user.isModified('password')) return next();

    generateUserPassword(user.password)
        .then((hash: any) => {
            user.password = String(hash);
            generateUserPassword(+(new Date()) + user.password)
                .then(confirmHash => {
                    user.confirm_hash = String(confirmHash);
                    next();
                })
        })
        .catch(err => next(err));
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;