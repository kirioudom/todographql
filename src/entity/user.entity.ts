import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Todo } from "./todo.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50 })
  firstName: string;
  @Column({ length: 50 })
  lastName: string;
  @OneToMany(type => Todo, todoEntity => todoEntity.user)
  todos: Todo[];
}
