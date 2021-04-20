import { Router, Request, Response } from "express";
import Post from "../entity/Post";

import auth from '../middleware/auth'

const createPost = async (req: Request, res: Response) => {
    const { title, body, cekirdek } = req.body

    const user = res.locals.user

    if (title.trim() === '') return res.status(400).json({ title: 'Title must not be empty' })

    try {
        //TODO: find sub

        const post = new Post({ title, body, user, cekirdekName: cekirdek })
        await post.save()

        return res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Someting went wrong' })
    }
}


const router = Router()

router.post('/', auth, createPost)

export default router