import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserPostgreSQLSchema {
  @Column()
  username: string;

  @PrimaryColumn()
  userId: string;

  @Column({ default: false })
  isActive: boolean;
}
