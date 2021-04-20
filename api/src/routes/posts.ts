import { Router, Request, Response } from 'express'
import Post from '../entity/Post'
import Cekirdek from '../entity/Cekirdek'

import auth from '../middleware/auth'

const createPost = async (req: Request, res: Response) => {
    const { title, body, cekirdek } = req.body

    const user = res.locals.user

    if (title.trim() === '') {
        return res.status(400).json({ title: 'Title must not be empty' })
    }

    try {
        // find sub
        const cekirdekRecord = await Cekirdek.findOneOrFail({ name: cekirdek })

        const post = new Post({ title, body, user, cekirdek: cekirdekRecord })
        await post.save()

        return res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const router = Router()

router.post('/', auth, createPost)

export default router
