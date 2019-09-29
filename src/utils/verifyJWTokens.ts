import jwt from 'jsonwebtoken';
// import {IUser} from "../models/User";

const verifyJWToken = (token: string) =>
    new Promise((resolve, reject) => {
        jwt.verify(token,
            process.env.JWT_SECRET || '',
            (err: any, decodedToken: any) => {
            if (err || !decodedToken) {
                return reject(err);
            }

            resolve(decodedToken);
        })
    });

export default verifyJWToken;