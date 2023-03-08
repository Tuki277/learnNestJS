import { Injectable } from '@nestjs/common';
import { UserMySQLSchema } from '../user/schemas/userMySQL.schema';
import { WhereOptions } from 'sequelize';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(UserMySQLSchema)
    private userModel: typeof UserMySQLSchema,
  ) {}

  async createUser(input: UserMySQLSchema | any): Promise<UserMySQLSchema> {
    return this.userModel.create(input);
  }

  async filter(query: WhereOptions<UserMySQLSchema>) {
    return this.userModel.findOne({
      where: query,
    });
  }
}
