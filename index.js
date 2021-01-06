import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import routers from './src/routes/routes';

import cors from 'cors'

const app = express();
app.use(cors())
const PORT = 5000;

//mongoose connection
mongoose.promise = global.Promise;
mongoose.connect('mongodb+srv://admin:uXdsVR6whubIGB4H@cluster0.jimrc.mongodb.net/ewallet?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

//body perser connection

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());




routers(app);

app.get('/', (req, res) => {
    res.send(`your server is running on port ${PORT}`)
})


app.listen(process.env.PORT || 5000, (req, resp) =>
    console.log(`your server is running on port ${PORT}`)
)