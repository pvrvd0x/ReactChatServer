import {json, Request, Response} from "express";
import { UserModel } from "../models";
import {createJWToken, generateUserPassword} from "../utils";
import { IUser } from "../models/User";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';


class UserController {
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
        console.log(req.body.user);
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
            .then((obj: any) => {
                res.json(obj);
                res.send();
            })
            .catch(error => {
                res.send(error);
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

        UserModel.findOne({ email: postData.email }, (err, user: IUser) => {
            if (err) {
                return res.status(404).json({message: "User not found"});
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
        });
    }
}

export default UserController;