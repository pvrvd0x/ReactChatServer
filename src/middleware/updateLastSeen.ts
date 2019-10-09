import {NextFunction, Request, Response} from "express";

import { UserModel } from "../models";

const updateLastSeen = (
    req: Request,
    res: Response,
    next: NextFunction) => {
        UserModel.updateOne(
            { email: req.body.email },
            { last_seen: new Date() },
            () => {}
        );
        next();
};

export default updateLastSeen;