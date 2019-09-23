import { Request, Response } from "express";

import { UserModel } from "../models";

const updateLastSeen = (
    req: Request,
    res: Response,
    next: () => void) => {
    UserModel.updateOne({
        _id: '5d874ddc83fe341b810505e3'
    }, {
        $set: {
            last_seen: new Date()
        }
    },
        () => {});
    next();
};

export default updateLastSeen;