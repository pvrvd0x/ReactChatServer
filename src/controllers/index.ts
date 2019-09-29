import { default as UserCtrl } from './User';
import { default as DialogsCtlr } from './Dialogs';
import { default as MessagesCtlr } from './Messages';

export const UserController = new UserCtrl();
export const DialogsController = new DialogsCtlr();
export const MessagesController = new MessagesCtlr();