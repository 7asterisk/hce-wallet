import mongoose from 'mongoose';


const Schema = mongoose.Schema;
export const UserSchema = new Schema({
    fname: String,
    lname: String,
    pno: {
        type: String, index: { unique: true }
    },
    walletId:
    {
        type: Schema.Types.ObjectId,
        ref: 'Wallet'
    },
    email: String,
    address: {
        state: String,
        city: String,
        country: String,
        pinCode: String
    },
    password: String
})

export const WalletSchema = new Schema({
    totalFund: Number,
    transection: [
        {
            status: String,
            time: Date,
            amount: Number,
            senderId: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            reseverId: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        }]
})

