import { Request, Response } from "express";
import {DialogsModel, MessageModel} from "../models";
import socket from "socket.io";

class DialogsController {
    private io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    public index(req: Request, res: Response) {
        const id = req.body.user.data._doc._id;

        DialogsModel
            .find({
                $or: [
                    { author: id },
                    { partner: id }
                ]
            })
            .populate(['author', 'partner'])
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'user'
                }
            })
            .exec()
            .then(dialogs => {
                res.json(dialogs)
            })
            .catch(() => res.status(404).json({message: 'Dialog not found'}));
    }

    public create(req: Request, res: Response) {
        const postData = {
            partner: req.body.partner,
            author: req.body.author
        };

        const dialog = new DialogsModel(postData);

        dialog
            .save()
            .then((dialog: any) => {
                const message = new MessageModel({
                    text: req.body.text,
                    dialog: dialog._id,
                    user: req.body.author,
                });

                message
                    .save()
                    .then((message: any) => {
                        res.json({
                            dialog: dialog,
                            message: message
                        })
                    })
                    .catch(err => res.json(err))
            })
            .catch(error => {
                res.send(error);
            })
    }

    public delete(req: Request, res:Response) {
        const id: string = req.params.id;

        DialogsModel.findOneAndDelete({_id: id})
            .then(dialog => {
                if (dialog) {
                    res.json({
                        message: `Dialog deleted`
                    })
                }
            })
            .catch(err => res.status(404).json('Dialog not found'))
    }
}

export default DialogsController;