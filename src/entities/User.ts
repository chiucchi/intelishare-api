import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Investigation } from "./Investigation";

@Entity('users') 
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text'})
    name: string;

    @Column({ type: 'text', unique: true})
    email: string;

    @Column({ type: 'text'})
    password: string;

    @Column({ type: 'text' })
    telephone: string;

    @Column({ type: 'timestamp' })
    birthDate: Date;

    @Column({ type: 'text'})
    uf: string;

    @Column({ type: 'text', array: true })
    notifications: string[];

    @OneToMany(() => Investigation, investigation => investigation.user)
    investigations: Investigation[];
}