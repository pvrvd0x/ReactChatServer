import jwt from 'jsonwebtoken';

const verifyJWToken = (token: string) =>
    new Promise((resolve, reject) => {
        // @ts-ignore
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err);
            }

            resolve(decodedToken);
        })
    });

export default verifyJWToken;