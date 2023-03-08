import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserMySQLSchema } from '../user/schemas/userMySQL.schema';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPostgreSQLSchema } from 'src/user/schemas/userPostgreSQL.schema';
import { SyncServicePostgre } from './syncpostgre.service';

@Module({
  imports: [
    SequelizeModule.forFeature([UserMySQLSchema]),
    TypeOrmModule.forFeature([UserPostgreSQLSchema]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [SyncController],
  providers: [SyncService, UserService, SyncServicePostgre],
})
export class SyncModule {}
