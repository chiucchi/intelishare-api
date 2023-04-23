import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity('investigations')
export class Investigation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false})
    name: string;

    @Column({ type: 'text', nullable: false})
    author: number;

    @Column({ type: 'text', array: true })
    tags: string[];

    @Column({ type: "integer", array: true})
    permitedUsers: number[]; // vai ser um array de ids de usuários

    @Column({ type: "bool", default: true })
    isPublic: boolean;

    @ManyToOne(() => User, user => user.investigations)
    @JoinColumn({ name: 'user_id' })
    user: User;
}