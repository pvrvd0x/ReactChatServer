import { Request, Response } from 'express';
import {MessageModel, DialogsModel} from "../models";
import { Server } from 'socket.io';

class MessageController {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    public index = (req: Request, res: Response) => {
        const dialogId: string = req.params.id;

        MessageModel.find({ dialog: dialogId })
            .populate(['dialog', 'user'])
            .exec()
            .then(message => res.json(message))
            .catch(() => res.status(404).json({message: 'Message not found'}));
    };

    public create = (req: Request, res: Response) => {
        const postData = {
            text: req.body.text,
            dialog: req.body.dialog,
            user: req.body.user.data._doc._id,
        };

        const message = new MessageModel(postData);

        message
            .save()
            .then((obj: any) => {
                obj.populate(['dialog', 'user'], (err: any, message: any) => {
                    if (err) {
                        return res
                                .status(500)
                                .json({
                                    status: 'error',
                                    message: err
                                });
                    }

                    DialogsModel.findOneAndUpdate(
                    { _id: postData.dialog },
                    { lastMessage: message._id },
                    { upsert: true },
                    (err) => {
                        if (err) {
                            return res.status(500).json({
                                status: 'error',
                                message: err
                            });
                        }
                    })

                res.json(message);

                this.io.emit('MESSAGES:NEW_MESSAGE', message);
            });
        })
    }

    public delete = (req: Request, res:Response) => {
        const id = req.params.id;

        MessageModel.findOneAndDelete({_id: id})
            .then((data: any) => {
                if (data.dialog) {
                    MessageModel.find(
                        {dialog: data.dialog},
                        (err, messages) => {
                            if (err) {
                                res.status(404).json({
                                    status: 'error',
                                    message: err
                                })
                            }

                            const lastMessage = messages[messages.length - 1];
                            
                            if (lastMessage) {
                                DialogsModel.findOneAndUpdate(
                                    {_id: data.dialog},
                                    { lastMessage: lastMessage._id},
                                    (err) => {
                                        if (err) {
                                            res.status(500).json({
                                                status: 'error',
                                                message: err,
                                            });
                                        }

                                        res.json({
                                            status: 'success',
                                            data
                                        });

                                        this.io.emit('MESSAGES:MESSAGE_DELETED');
                                    }
                                )
                            } else {
                                DialogsModel.findOneAndDelete(
                                    {_id: data.dialog},
                                    (err) => {
                                        if (err) {
                                            res.status(500).json({
                                                status: 'error',
                                                message: err
                                            })
                                        }

                                        res.json({
                                            status: 'success',
                                            data
                                        });

                                        this.io.emit('MESSAGE:MESSAGE_DELETED');
                                    }
                                )
                            }
                    })
                }
            })
            .catch(err => res.json(err))
    }
}

export default MessageController;