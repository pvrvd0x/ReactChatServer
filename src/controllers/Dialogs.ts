import { Request, Response } from "express";
import {DialogsModel, MessageModel} from "../models";
import socket from "socket.io";

class DialogsController {
    private io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    public index = (req: Request, res: Response) => {
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

    public create = (req: Request, res: Response) => {
        const postData = {
            partner: req.body.partner,
            author: req.body.user.data._doc._id,
        };

        const dialog = new DialogsModel(postData);

        dialog
            .save()
            .then((dialogObject: any) => {
                const message = new MessageModel({
                    text: req.body.text,
                    dialog: dialogObject._id,
                    user: req.body.user.data._doc._id,
                });

                message
                    .save()
                    .then(() => {
                        dialog.lastMessage = message._id;

                        dialogObject
                            .save()
                            .then(() => {
                                res.json(dialogObject);

                                this.io.emit('SERVER:DIALOG_CREATED', {
                                    ...postData,
                                    dialog: dialogObject
                                })
                            })
                    })
                    .catch(err => res.json(err))
            })
            .catch(error => {
                res.json(error);
            })
    }

    public delete = (req: Request, res:Response) => {
        const id: string = req.params.id;

        DialogsModel.findOneAndDelete({_id: id})
            .then(dialog => {
                if (dialog) {
                    res.json({
                        message: `Dialog deleted`
                    })
                }
            })
            .catch(() => res.status(404).json('Dialog not found'))
    }
}

export default DialogsController;