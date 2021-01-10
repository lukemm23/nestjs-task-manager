import { Entity,BaseEntity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import {Task} from '../tasks/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    salt: string;

    // eager from 'one' side is true to be able to get 'many' tasks immediately
    @OneToMany(type => Task, task => task.user, {eager:true})
    tasks:Task[];

    // custom method for validating pw
    async validatePassword(password:string):Promise<boolean>{
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

}