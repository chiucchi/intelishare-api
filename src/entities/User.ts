import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Investigation } from "./Investigation";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "text" })
  password: string;

  @Column({ type: "text" })
  telephone: string;

  @Column({ type: "date", nullable: true })
  birthDate: Date;

  @Column({ type: "text" })
  uf: string;

  @Column({ type: "text", array: true })
  notifications: {
    title: string;
    type: string;
    relatedInvestigationAuthor: number;
    relatedInvestigationId: number;
    description: string;
    response?: boolean;
    askAccess?: boolean;
  }[];

  @OneToMany(() => Investigation, (investigation) => investigation.user)
  investigations: Investigation[];
}
