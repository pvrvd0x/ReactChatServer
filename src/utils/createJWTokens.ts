import jwt from 'jsonwebtoken';
import { reduce } from 'lodash';

import { IUser } from "../models/User";

const createJWTokens = (user: IUser) => {
    let token = jwt.sign(
        {
            data: reduce(user, (result, key, value) => {
                if (key !== 'password') {
                    // @ts-ignore
                    result[key] = value;
                }

                return result;
            }, {}),
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_MAX_AGE,
            algorithm: 'HS256'
        }
    );

    return token;
};