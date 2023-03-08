import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserPostgreSQLSchema } from 'src/user/schemas/userPostgreSQL.schema';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class SyncServicePostgre {
  constructor(
    @InjectModel(UserPostgreSQLSchema)
    private userModel: Repository<UserPostgreSQLSchema>,
  ) {}

  async createUserPostgre(input: UserPostgreSQLSchema): Promise<InsertResult> {
    return this.userModel.insert(input);
  }

  async filterPostgre(id: string): Promise<UserPostgreSQLSchema[]> {
    return this.userModel.find({
      where: {
        userId: id,
      },
    });
  }
}
