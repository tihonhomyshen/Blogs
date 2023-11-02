import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import {loginValidation, registerValidation} from "./validations/authValidation.js";
import {blogCreateValidation}  from "./validations/blogValidation.js";


import checkAuth from './middleware/checkAuth.js';

import * as UserController from './controllers/UserController.js'
import * as BlogController from './controllers/BlogController.js'


mongoose
    .connect(
        "mongodb+srv://lilofrich:яоченьсильнодорожуульяной@cluster0.iqo5n9n.mongodb.net/blog?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB OK"))
    .catch((err) => console.log("DB ERROR", err));

const app = express();

const storageImages = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage: storageImages});

app.use(express.json());

app.post("/login", loginValidation, UserController.login)
app.post("/register", registerValidation, UserController.register);
app.get("/me", checkAuth, UserController.getMe)

app.post("/upload", checkAuth, upload.single('image'), (req, res) => {
        res.json({
            url: `/uploads/${req.file.originalname}`,
        });

});

app.get("/blogs", BlogController.getAll);
app.get("/blogs/:id", BlogController.getOne);
app.post("/blogs", checkAuth, blogCreateValidation, BlogController.create);
app.delete("/blogs/:id", checkAuth, BlogController.remove);
app.patch("/blogs/:id", checkAuth, BlogController.update);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});
