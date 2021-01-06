import mongoose from 'mongoose';
import JsonWebToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import * as mailer from './mailerComponent';

import dotenv from 'dotenv';
dotenv.config();

import {
    UserSchema, WalletSchema
} from '../models/model';

// const Contact = mongoose.model('Contact', ContactSchema);
const User = mongoose.model('User', UserSchema);
var docName;
var schemaName;

function getModel(doc) {
    if (doc == 'User') {
        docName = 'User';
        schemaName = UserSchema;
    } else if (doc === 'Wallet') {
        docName = 'Wallet';
        schemaName = WalletSchema
    }
}

export const getData = (req, res) => {
    const qry = req.body;
    getModel(qry.to)
    const DataModel = mongoose.model(docName, schemaName);
    if (qry.populate) {
        console.log(qry.populate);
        DataModel.find(qry.filter, qry.projection).populate(qry.populate).populate(qry.popilate2).exec(function (err, dept) {
            if (err) {
                res.send(err);
            }
            res.send(dept);
        })
    } else {
        DataModel.find(qry.filter, qry.projection, (err, dept) => {
            if (err) {
                res.send(err);
            }
            res.send(dept);
        })
    }

}




export const transferFund = (req, res) => {
    console.log(req.body);
    const WalletModel = mongoose.model('Wallet', WalletSchema);

    const senderWalletId = req.body.senderWalletId;
    const reseverWalletId = req.body.reseverWalletId;
    const fundsToTransfer = req.body.fundsToTransfer;
    const reseverId = req.body.reseverId;
    const senderId = req.body.senderId;

    WalletModel.findOne({ _id: senderWalletId }, (err, senderWallet) => {
        if (err) {
            res.send(err);
        }
        if (fundsToTransfer > senderWallet.totalFund) {
            res.send({ msg: "Insufesint funds to transfer" });
        }

        WalletModel.findOne({ _id: reseverWalletId }, (err, reseverWallet) => {
            if (err) {
                res.send(err);
            }

            WalletModel.findOneAndUpdate({ _id: senderWalletId },
                {
                    totalFund: senderWallet.totalFund - fundsToTransfer, $push:
                    {
                        transection: {
                            status: 'sended',
                            time: Date.now(),
                            reseverId: reseverId,
                            amount: fundsToTransfer,
                        }
                    }
                }, () => {
                    WalletModel.findOneAndUpdate({ _id: reseverWalletId }, {
                        totalFund: Number(reseverWallet.totalFund) + Number(fundsToTransfer),

                        $push:
                        {
                            transection: {
                                status: 'received',
                                time: Date.now(),
                                senderId: senderId,
                                amount: fundsToTransfer,
                            }
                        }

                    }, () => {
                        res.send({ msg: 'funds transfered', totalFund: senderWallet.totalFund - fundsToTransfer });

                    });
                });
        })
    })
}



export const signup = (req, res) => {
    getModel('User');
    const DataModel = mongoose.model(docName, schemaName);
    const WalletModel = mongoose.model('Wallet', WalletSchema);
    let newwallet = new WalletModel({ totalFund: 0 });
    newwallet.save((err, walletData) => {
        if (err) {
            res.send(err);
        }
        // console.log(walletData);
        req.body.walletId = walletData._id;

        let newUser = new DataModel(req.body);
        var hashedPassword = bcrypt.hashSync(newUser.password, 10)
        newUser.password = hashedPassword;
        newUser.save((errr, user) => {
            if (errr) {
                res.send(errr);
            }
            const payload = {
                pno: newUser.pno,
                role: 'user'
            };


            const token = JsonWebToken.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2d'
            });


            return res.json({
                msg: "Account Created Successfuly",
                token: token,
                userId: user._id
            })
            // res.json(wallet)
        })

    })
}



export const login = (req, res) => {
    const qry = req.body;
    getModel('User');
    const DataModel = mongoose.model(docName, schemaName);
    DataModel.findOne({
        pno: qry.pno
    }, (err, result) => {
        if (!result) {
            return res.status(404).json({
                msg: "user not found!"
            });
        }
        bcrypt.compare(qry.password, result.password, (err, isAuth) => {
            if (!isAuth) {
                return res.status(401).json({
                    msg: "Incorrect Password"
                });
            }
            const payload = {
                pno: qry.pno,
            };
            const token = JsonWebToken.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2d'
            });
            return res.json({
                msg: "Login Successfuly",
                token: token,
                userId: result._id
            })
        });
    });


}

export const resetPass = (req, res) => {
    const qry = req.body;
    getModel(qry.to);
    const DataModel = mongoose.model(docName, schemaName);

    var mykey = crypto.createDecipher('aes-128-cbc', process.env.JWT_SECRET);
    var emailId = mykey.update(qry.hash, 'hex', 'utf8')
    emailId += mykey.final('utf8');

    console.log(emailId);

    DataModel.findOne({
        emailId: emailId
    }, (err, result) => {
        if (!result) {
            return res.status(404).json({
                msg: "user not found!"
            });
        }
        else {
            var hashedPassword = bcrypt.hashSync(req.body.password, 10)
            DataModel.findOneAndUpdate({
                _id: result._id
            }, { password: hashedPassword }, {
                new: true
            }, (err, student) => {
                if (err) {
                    res.send(err);
                }
                res.json(student);
            })
        }
    });
}



export const forgotPassword = (req, res) => {
    const qry = req.body;
    getModel(qry.to)
    const DataModel = mongoose.model(docName, schemaName);

    DataModel.findOne({ pno: qry.pno }, (err, user) => {
        if (user) {
            var mykey = crypto.createCipher('aes-128-cbc', process.env.JWT_SECRET);
            var mystr = mykey.update(req.body.forgotEmail, 'utf8', 'hex')
            mystr += mykey.final('hex');
            let body = 'http://localhost:4200/resetpassword/' + mystr;
            mailer.sendMail(req.body.forgotEmail, body);
            res.send({ message: 'Reset link sent to your email!' });
        } else {
            res.send({ message: "Email Id not Found" });
        }
    })


}