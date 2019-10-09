import { Schema, model, Document} from "mongoose";

interface IDialogs extends Document {
    partner: {
        type: Schema.Types.ObjectId,
        ref: string,
    };
    author: {
        type: Schema.Types.ObjectId,
        ref: string,
    };
    lastMessage?: {
        type: Schema.Types.ObjectId,
        ref: string,
        user: Schema.Types.ObjectId,
    };
}

const DialogSchema = new Schema({
    partner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
},
    {
        timestamps: true,
    });

const DialogsModel = model<IDialogs>('Dialog', DialogSchema);

export default DialogsModel;