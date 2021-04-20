import {
    Entity as TOEntity,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm'

import { makeId, slugify } from '../util/helpers'

import Entity from './Entity'
import User from './User'
import Post from './Post'

@TOEntity('cekirdekler')
export default class Cekirdek extends Entity {
    constructor(cekirdek: Partial<Cekirdek>) {
        super()
        Object.assign(this, cekirdek)
    }

    @Column({ unique: true })
    name: string

    @Column()
    title: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ nullable: true })
    imageUrn: string

    @Column({ nullable: true })
    bannerUrn: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @OneToMany(() => Post, post => post.cekirdek)
    posts: Post[]
}
