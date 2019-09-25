import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "char", length: 50 })
  task: string;
  @Column({ default: false })
  done: boolean;
}
