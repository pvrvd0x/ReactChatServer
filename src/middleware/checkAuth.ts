import {NextFunction, Request, Response} from "express";
import {verifyJWToken} from "../utils";

const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
    const restrictedRoutes = [
        '/user/login',
        '/user/register',
        '/user/verify',
    ];
    
    if (restrictedRoutes.includes(req.path)) {
        return next();
    }

    const token: any = req.headers.token;

    verifyJWToken(token)
        .then((user: any) => {
            req.user = user.data._doc;
            next()
        })
        .catch(() => res.status(403).json({message: 'Invalid auth token provided'}));
};

export default checkAuth;