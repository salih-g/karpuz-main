import { Request, Response, Router } from 'express'
import { isEmpty } from 'class-validator'
import { getMongoRepository } from 'typeorm'

import User from '../entity/User'
import Cekirdek from '../entity/Cekirdek'
import auth from '../middleware/auth'

const createCekirdek = async (req: Request, res: Response) => {
    const { name, title, description } = req.body

    const user: User = res.locals.user

    try {

        let errors: any = {}
        if (isEmpty(name)) errors.name = 'Name must not be empty'
        if (isEmpty(title)) errors.title = 'Title must not be empty'


        console.log(errors)

        if (Object.keys(errors).length > 0) {
            throw errors
        }
    } catch (err) {
        return res.status(400).json(err)
    }

    try {
        const cekirdek = new Cekirdek({ name, description, title, user })
        await cekirdek.save()

        return res.json(cekirdek)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const router = Router()

router.post('/', auth, createCekirdek)

export default router
