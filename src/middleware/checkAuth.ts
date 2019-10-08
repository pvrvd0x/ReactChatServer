import { Request, Response, NextFunction } from "express";
import { verifyJWToken } from "../utils";

const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
    const restrictedRoutes = [
        '/user/login',
        '/user/register',
        '/user/verify',
    ]
    
    if (restrictedRoutes.includes(req.path)) {
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