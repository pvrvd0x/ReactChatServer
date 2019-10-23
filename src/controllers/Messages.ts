import { Request, Response } from 'express';
import {MessageModel, DialogsModel} from "../models";
import { Server } from 'socket.io';

class MessageController {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    public index = (req: any, res: Response) => {
        const dialogId: string = req.params.id,
            userId: any = req.user._id;

        MessageModel.updateMany(
            { dialog: dialogId, user: { $ne: userId } },
            { "$set": { unchecked: false } },
            (err: any) => {
                if (err) {
                    return res.status(500).json({
                        status: 'error',
                        message: err,
                    })
                }
            });

        MessageModel.find({ dialog: dialogId })
            .populate(['dialog', 'user', 'attachments'])
            .exec()
            .then(message => res.json(message))
            .catch(() => res.status(404).json({message: 'Message not found'}));
    };

    public create = (req: any, res: Response) => {
        const postData = {
            text: req.body.text,
            user: req.user._id,
            attachments: req.body.attachments,
            dialog: req.body.dialog,
        };

        if (postData.text || postData.attachments) {
            const message = new MessageModel(postData);

            message
                .save()
                .then((obj: any) => {
                    obj.populate(['dialog', 'user', 'attachments'], (err: any, message: any) => {
                        if (err) {
                            return res
                                .status(500)
                                .json({
                                    status: 'error',
                                    message: err
                                });
                        }

                        DialogsModel.findOneAndUpdate(
                            {_id: postData.dialog},
                            {lastMessage: message._id},
                            {upsert: true},
                            (err) => {
                                if (err) {
                                    return res.status(500).json({
                                        status: 'error',
                                        message: err
                                    });
                                }
                            });

                        res.json({
                            status: 'success',
                            message: message,
                        });

                        this.io.emit('MESSAGES:NEW_MESSAGE', message);
                    });
                })
        }
    };

    public delete = (req: Request, res: Response) => {
        const id = req.params.id;
        const userId = req.body.user.data._doc._id;

        MessageModel.findById(id, (err, message) => {
            if (err || !message) {
                return res.status(404).json({
                    message: 'Message not found',
                    status: 'error'
                })
            }

            if(userId.toString() === message.user.toString()) {
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
                                        }
                                    )
                                }
                        })
                    }
                })
                .catch(err => res.json(err))    
            } else {
                return res.status(403).json({
                    status: 'error',
                    message: 'Not permitted'
                })
            }
        })
    }
}

export default MessageController;