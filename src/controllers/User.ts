import {Request, Response} from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import { Server } from 'socket.io';

import { UserModel } from "../models";
import {createJWToken} from "../utils";
import { IUser } from "../models/User";


class UserController {
    private io: Server;

    constructor(io: Server) {
        this.io = io
    }


    public index(req: Request, res: Response) {
        const id: string = req.params.id;

        UserModel.findById(id, (err, user) => {
            if (err) {
                return res
                    .status(404)
                    .json({message: 'Not Found'})
            }
            res.json(user);
        })
    }

    public getMe(req: Request, res: Response) {
        const myId = req.body.user.data._doc._id;

        UserModel.findById(myId, (err, user) => {
            if (err) {
                return res
                    .status(404)
                    .json({message: 'Not found'})
            }

            res.json(user);
        })
    }

    public create(req: Request, res: Response) {
        const postData: object = {
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password,
        };

        const user = new UserModel(postData);

        user
            .save()
            .then((obj: IUser) => {
                res.json({...obj, status: 'success'});
            })
            .catch(error => {
                res.json({...error, status: 'error'});
            })
    }

    public delete(req: Request, res: Response) {
        const id = req.params.id;

        UserModel.findOneAndRemove({ _id: id })
            .then(user => {
                if (user) {
                    res.json({
                        message: `User ${user.fullname} deleted`
                    })
                }
            })
            .catch(err => {
                res.json({
                    message: 'Not Found'
                })
            });
    }

    public login(req: Request, res: Response) {
        const postData = {
            email: req.body.email,
            password: req.body.password,
        };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        UserModel
            .findOne({ email: postData.email })
            .then((user: IUser | null) => {
                if (!user) {
                    return res.status(404).json({message: 'User not found'});
                }

                bcrypt.compare(postData.password, user.password, (err, success) => {
                    if (err) {
                        return res.json({message: err});
                    }
                    if (success) {
                        const token = createJWToken(user);
    
                        res
                            .json({
                                status: 'success',
                                token
                            })
                    } else {
                        return res.json({status: 'error', message: 'Incorrect password or email'})
                    }
                });
            })
            .catch(() => res.status(404).json({message: "User not found"}));
    };
}

export default UserController;