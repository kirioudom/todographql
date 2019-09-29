import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "char", length: 50 })
  task: string;
  @Column({ default: false })
  done: boolean;
  @ManyToOne(type => User, user => user.todos)
  user: User;
}
