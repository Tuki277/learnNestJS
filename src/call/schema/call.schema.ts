import { AllowNull, Column, Default, Model, Table } from 'sequelize-typescript';

@Table
export class CallSchema extends Model {
  @AllowNull
  @Column
  username: string;

  @AllowNull
  @Column
  userId: string;

  @Default(false)
  @AllowNull
  @Column
  isCall: boolean;
}
