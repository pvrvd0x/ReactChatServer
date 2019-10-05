import mongoose from 'mongoose';

const configureDBConnection = (
    host: string,
    port: number,
    db: string,
    options: object) =>
    mongoose.connect(`mongodb://${host}:${port}/${db}`, options);

export default configureDBConnection;