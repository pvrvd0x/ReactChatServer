import bcrypt from 'bcryptjs';

const generateUserPassword = (password: string) =>
    new Promise(((resolve, reject) => {
        bcrypt.genSalt((err, salt) => {
            if (err) reject(err);

            bcrypt.hash(password, salt, (err: any, hash: string) => {
                if (err) reject(err);

                resolve(hash);
            })
        })
    }));

export default generateUserPassword;