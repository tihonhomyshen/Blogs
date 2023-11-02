import BlogModel from '../models/Blog.js';

export const getAll = async (req, res) => {
    try {
        const blogs = await BlogModel.find().
        populate({path: "user", select:["fullName", "avatarUrl"]}).exec();

        res.json(blogs);
    } catch (err) {
        res.status(500).json({
            message: "Не удалось получить статьи",
        });
    }
}

export const getOne = async (req, res) => {
    try{
        const blogId = req.params.id;

        let doc = await BlogModel.findByIdAndUpdate(
        {
            _id: blogId,
        },
        {
            $inc: {viewsCount: 1},
        },
        {
            returnDocument: 'after',
        })
            res.json(doc);
    } 
    catch (err){
        return res.status(500).json({
            message: "Не удалось вернуть статью",
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new BlogModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const blog = await doc.save();
        res.json(blog);

    } catch (err){ 
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать статью",
        });
    }
}

export const remove = async (req, res) => {
    try{
        const blogId = req.params.id;
        console.log(blogId);
        await BlogModel.findByIdAndDelete({
            _id: blogId,
        }).then((doc) => {
            if (!doc){
                return res.status(404).json({
                    message: 'Статьи не существует',
                })
            }
            res.json({
                success: true,
            });
        });
    } 
    catch (err){
        console.log(err);
        return res.status(500).json({
            message: "Не удалось удалить статью",
        });
    }
}

export const update = async (req, res) => {
    try {
        const blogId = req.params.id;

        await BlogModel.updateOne({
            _id: blogId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        res.json({
            success: true,
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Не удалось обновить статью",
        });
    }
}