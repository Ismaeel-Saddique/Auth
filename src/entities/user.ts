import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'users'})
export class UserEntity{
    @ PrimaryGeneratedColumn()
    id: string;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column({nullable:true})
    refreshToken: string;

}