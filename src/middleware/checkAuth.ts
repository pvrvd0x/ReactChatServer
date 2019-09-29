import { Request, Response, NextFunction } from "express";
import { verifyJWToken } from "../utils";
// import { IUser } from "../models/User";

const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
    if (req.path === '/user/login' || req.path === '/user/register') {
        return next();
    }

    const token: any = req.headers.token;

    verifyJWToken(token)
        .then((user: any) => {
            req.body.user = user;
            next()
        })
        .catch(() => res.status(403).json({message: 'Invalid auth token provided'}));
};

export default checkAuth;