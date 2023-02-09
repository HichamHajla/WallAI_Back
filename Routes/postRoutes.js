import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary'
import verify from "../middlewares/verify.js";

import Post from '../mongoDB/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

router.get('/', async (req,res) => {
    try {
        const posts = await Post.find({})

        res.status(200).json({ success : true, data : posts })
    } catch(error) {
        res.status(500).json({ success : false, message : error })
    }
})

router.get('/user/:userId', async (req,res) => {
    try {
        const posts = await Post.find({userId : req.params.userId})

        res.status(200).json({ success : true, data : posts })
    } catch(error) {
        res.status(500).json({ success : false, message : error })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findOne({_id : req.params.id})

        res.status(200).json({ success : true, data : post })
    } catch(error) {
        res.status(500).json({ success : false, message : error })
    }
   
})

router.post('/', async (req,res) => {
    try {
        const { name, prompt, photo } = req.body;
      
    const photoUrl = await cloudinary.uploader.upload(photo);

    const newPost = await Post.create({
        name,
        prompt,
        photo: photoUrl.url,
        userId : req.body.userId
    })

    res.status(201).json({ success : true, data : newPost})
    } catch(error) {
    res.status(500).json({ success : false, message : error}) 
    }
})

router.delete('/:id', (req, res) => {
    Post.deleteOne({_id : req.params.id})
    .then(() => res.json("deleted successfully"))
    .catch(err => res.json(err))
})

export default router;