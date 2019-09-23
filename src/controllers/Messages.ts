import { Request, Response } from 'express';
import { MessageModel } from "../models";

class MessageController {
    public index(req: Request, res: Response) {
        const dialogId: string = req.params.id;

        MessageModel.find({ dialog: dialogId })
            .populate('dialog')
            .exec((err, message) => {
                if (err) {
                    console.log(err);
                    return res.status(404).json({message: 'Message not found'});
                }

                res.json(message);
            })
    }

    public create(req: Request, res: Response) {
        const postData = {
            text: req.body.text,
            dialog: req.body.dialog,
            user: req.body.user,
        };

        const messages = new MessageModel(postData);

        messages
            .save()
            .then((obj: any) => {
                res.json(obj);
            })
            .catch(err => res.send(err))
    }

    public delete(req: Request, res:Response) {
        const id = req.params.id;

        MessageModel.findOneAndDelete({_id: id})
            .then(dialog => {
                if (dialog) {
                    res.json({ message: "Message Deleted" });
                }
            })
            .catch(err => res.json(err))
    }
}

export default MessageController;