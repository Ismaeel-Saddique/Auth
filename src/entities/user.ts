import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'users'})
export class user{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

}