import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import {loginValidation, registerValidation} from "./validations/authValidation.js";
import {blogCreateValidation}  from "./validations/blogValidation.js";

import {checkAuth, handleErrors} from './middleware/checkAuth.js';
import {UserController, BlogController} from "./controllers/index.js";

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));


mongoose
    .connect(
        "mongodb+srv://lilofrich:яоченьсильнодорожуульяной@cluster0.iqo5n9n.mongodb.net/blog?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB OK"))
    .catch((err) => console.log("DB ERROR", err));


const upload = multer({storage: storageImages});
const storageImages = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

app.post("/login", loginValidation, handleErrors, UserController.login)
app.post("/register", registerValidation, handleErrors, UserController.register);
app.get("/me", checkAuth, UserController.getMe)

app.post("/upload", checkAuth, upload.single('image'), (req, res) => {
        res.json({
            url: `/uploads/${req.file.originalname}`,
        });

});

app.get("/blogs", BlogController.getAll);
app.get("/blogs/:id", BlogController.getOne);
app.post("/blogs", checkAuth, blogCreateValidation, handleErrors, BlogController.create);
app.delete("/blogs/:id", checkAuth, BlogController.remove);
app.patch("/blogs/:id", checkAuth, blogCreateValidation, handleErrors, BlogController.update);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});
