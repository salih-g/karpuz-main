import { IsEmail, Length } from 'class-validator'
import {
    Entity as TOEntity,
    Column,
    Index,
    BeforeInsert,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import bcrypt from 'bcrypt'
import { Exclude } from 'class-transformer'

import Entity from './Entity'
import User from './User'
import { makeId, slugify } from '../util/helpers'
import Cekirdek from './Cekirdek'

@TOEntity('posts')
export default class Post extends Entity {
    constructor(post: Partial<Post>) {
        super()
        Object.assign(this, post)
    }

    @Index()
    @Column()
    identifier: string // 7 Character Id

    @Column()
    title: string

    @Index()
    @Column()
    slug: string

    @Column({ nullable: true, type: 'text' })
    body: string

    @Column()
    cekirdekName: string

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @ManyToOne(() => Cekirdek, (cekirdek) => cekirdek.posts)
    @JoinColumn({ name: 'cekirdekName', referencedColumnName: 'name' })
    cekirdek: Cekirdek

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(7)
        this.slug = slugify(this.title)
    }
}
