import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


import { validationResult } from 'express-validator';
import { registerValidation } from './validations/auth.js';

import UserModel from './models/User.js';

mongoose.connect('mongodb+srv://lilofrich:яоченьсильнодорожуульяной@cluster0.iqo5n9n.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log("DB OK"))
.catch((err) => console.log('DB ERROR', err));


const app = express();
app.use(express.json());

app.post('/register', registerValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash,
    });

    const user = await doc.save();

    res.json(user);
});




app.listen(4444, (err) =>{
    if (err){
        return console.log(err);
    }

    console.log('Server OK');
});
