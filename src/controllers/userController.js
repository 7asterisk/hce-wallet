import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


import {
    UserSchema
} from '../models/model';

const DataModel = mongoose.model('user', UserSchema);


export const getUser = (req, res) => {
    const qry = req.body;
    DataModel.find(qry.filter, qry.projection, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.send(user);
    })
}

export const getUserById = (req, res) => {
    console.log(req.params.userId);
    DataModel.findById(req.params.userId, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json(user)
    })
}


export const updateUser = (req, res) => {
    DataModel.findOneAndUpdate({
        _id: req.params.userId
    }, req.body, {
        new: true,
        useFindAndModify: false
    }, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json(user);
    })
}

export const deleteUser = (req, res) => {
    DataModel.remove({
        _id: req.params.userId
    }, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json({
            message: 'delted successfuly!'
        });
    });
}