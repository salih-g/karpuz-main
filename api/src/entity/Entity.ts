import {
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    ObjectIdColumn,
} from 'typeorm'
import { classToPlain, Exclude } from 'class-transformer'

export default abstract class Entity extends BaseEntity {
    @Exclude()
    @ObjectIdColumn()
    id: number

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    toJSON() {
        return classToPlain(this)
    }
}
