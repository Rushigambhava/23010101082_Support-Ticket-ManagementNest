import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['MANAGER', 'SUPPORT', 'USER'], unique: true })
  name: string;
}
