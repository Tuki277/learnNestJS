import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WalletSchema {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  total: number;

  @Column()
  userId: string;

  @Column()
  name: string;
}
