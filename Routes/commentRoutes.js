import express from "express";
import Comment from "../mongoDB/models/comment.js"


const router = express.Router();

router.get('/', async (req,res)=>{
    try {
        const comments = await  Comment.find({})
            res.status(200).json({ success : true, data : comments })
        } catch(error) {
            res.status(500).json({ success : false, message : error })
    }
})

router.get('/post/:postId', async (req,res)=>{
    try {
        const comments = await  Comment.find({postId : req.params.postId})
            res.status(200).json({ success : true, data : comments })
        } catch(error) {
            res.status(500).json({ success : false, message : error })
    }
})

router.get('/:id', (req, res) => {
    Comment
    .findOne({_id : req.params.id})
    .then(OneComment => res.json(OneComment))
    .catch(err => res.json(err))
})


router.post('/',(req,res)=>{
    Comment
    .create(req.body)
    .then(newComment => res.json(newComment))
    .catch(err => res.json(err))
})

router.put('/:id', async (req,res) => {
    await Comment.findOne({_id : req.params.id})
    await Comment.updateOne({$set : req.body})
    await Comment.findOne({_id : req.params.id})
    .then(newComment => res.json(newComment))
    .catch(err => res.json(err))
})

router.delete('/:id', (req, res) => {
    Comment.deleteOne({_id : req.params.id})
    .then(() => res.json("deleted successfully"))
    .catch(err => res.json(err))
})

export default router;