import mongoose from 'mongoose';

const configureDBConnection = (
    host: string,
    db: string,
    userName: string,
    password: string,
    options: object) =>
    mongoose.connect(`mongodb+srv://${userName}:${password}@${host}/${db}?retryWrites=true&w=majority`, options)

export default configureDBConnection;
