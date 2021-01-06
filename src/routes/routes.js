const checkJwt = require('express-jwt');
import dotenv from 'dotenv';
dotenv.config();

import { updateUser, getUserById, getUser, deleteUser } from '../controllers/userController';
import { updateWallet, getWalletById } from '../controllers/walletController';
import {
    getData,
    login,
    signup,
    resetPass,
    forgotPassword,
    transferFund
} from '../controllers/controller';

const routes = (app) => {
    app.use(checkJwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256']
    }).unless({
        path: ['/login', '/resetpassword', '/forgotpassword', '/signup']
    }));
    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send({
                error: err.message
            });
        }
    })

    // user route
    app.route('/user/:userId')
        .put(updateUser)
        .get(getUserById)
        .delete(deleteUser);

    // user route
    app.route('/wallet/:id')
        .put(updateWallet)
        .get(getWalletById);

    app.route('/wallet')
        .get(getUser);





    // get filter deta
    app.route('/getFilterData')
        .post(getData);
    app.route('/login')
        .post(login);
    app.route('/resetpassword')
        .post(resetPass);
    app.route('/forgotpassword')
        .post(forgotPassword);
    app.route('/signup')
        .post(signup);
    app.route('/transferFund')
        .post(transferFund);

}



export default routes