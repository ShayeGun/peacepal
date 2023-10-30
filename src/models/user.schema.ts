import { Model, model, Schema } from 'mongoose';
import validator from 'validator';

export interface IUser {
    email: string;
}

export interface IUserMethods { }

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'not valid phone number']
    },
}, {
    toJSON: {
        // convert _id to id
        virtuals: true,
        // remove __v
        versionKey: false,
        // remove _id 
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.refreshToken;
            // delete ret.__v;
        }
    },
});

const User = model<IUser, UserModel>('User', userSchema);

export { User };