import mongoose from 'mongoose';

import { WalletSchema } from '../models/model';

const DataModel = mongoose.model('wallet', WalletSchema);

export const createWallet = (req, res) => {

    let newwallet = new DataModel(req.body);
    newwallet.save((err, wallet) => {
        if (err) {
            res.send(err);
        }
        res.json(wallet)
    })
}


export const getWalletById = (req, res) => {
    DataModel.findById(req.params.id, (err, wallet) => {
        if (err) {
            res.send(err);
        }
        res.json(wallet)
    })
}


export const updateWallet = (req, res) => {
    DataModel.findOneAndUpdate({
        _id: req.params.id
    }, req.body, {
        new: true,
        useFindAndModify: false
    }, (err, wallet) => {
        if (err) {
            res.send(err);
        }
        res.json(wallet);
    })
}

export const deleteWallet = (req, res) => {
    DataModel.remove({
        _id: req.params.id
    }, (err, wallet) => {
        if (err) {
            res.send(err);
        }
        res.json({
            message: 'deleted successfuly!'
        });
    });
}