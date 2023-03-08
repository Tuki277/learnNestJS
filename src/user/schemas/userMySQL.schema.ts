import {
  AllowNull,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class UserMySQLSchema extends Model {
  @AllowNull
  @Column
  fullname: string;

  @PrimaryKey
  @AllowNull
  @Column
  userId: string;
}
