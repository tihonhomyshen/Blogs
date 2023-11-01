import BlogModel from '../models/Blog.js';

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
            message: 'Не удалось создать статью',
        });
    }
}