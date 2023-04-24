import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity("investigations")
export class Investigation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  author: string;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "text", nullable: true })
  uf: string;

  @Column({ type: "bool", default: true })
  isPublic: boolean;

  @Column({ type: "text", array: true })
  involveds: string[]; // vai ser um array de nomes de pessoas envolvidas

  @Column({ type: "text", array: true })
  tags: string[]; // tags da investigação

  @Column({ type: "bytea", nullable: true })
  files: Buffer; // vai salvar um arquivo .zip de até 1gb

  @Column({ type: "integer", array: true })
  permitedUsers: number[]; // vai ser um array de ids de usuários

  @ManyToOne(() => User, (user) => user.investigations)
  @JoinColumn({ name: "user_id" })
  user: User;
}
