import { Request, Response } from "express";
import { UserModel } from "../models";

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
}

export default UserController;