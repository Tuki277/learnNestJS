import { Controller, Get, Next, Req, Res } from '@nestjs/common';
import { SyncService } from './sync.service';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { dataSync, dataSyncPostgreSQL } from './sync.validate';
import { UserDocument } from '../user/schemas/user.schema';
import { JsonResponse } from '../helpers';
import { ApiTags } from '@nestjs/swagger';
import { SyncServicePostgre } from './syncpostgre.service';

@ApiTags('sync')
@Controller('sync')
export class SyncController {
  constructor(
    private syncService: SyncService,
    private userMongoService: UserService,
    private syncServiceForPostgreSQL: SyncServicePostgre,
  ) {}

  @Get('/')
  async syncData(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      //lay ra user ben mongo
      const dataUserMongo = await this.userMongoService.getAllUser();

      // add user vao mysql
      dataUserMongo.map(async (x: UserDocument) => {
        await dataSync.validateAsync({
          fullname: x.fullname,
          userId: x._id.toString(),
        });
        if (!(await this.syncService.filter({ userId: x._id.toString() }))) {
          await this.syncService.createUser({
            fullname: x.fullname,
            userId: x._id.toString(),
          });
        }
      });
      return res.status(201).json(JsonResponse(false, 'Sync Done'));
    } catch (e) {
      if (e.isJoi) {
        return res.status(422).json(JsonResponse(false, e.messages));
      }
    }
  }

  @Get('postgre')
  async syncDataPostgre(@Req() req: Request, @Res() res: Response) {
    try {
      //lay ra user ben mongo
      const dataUserMongo = await this.userMongoService.getAllUser();

      // add user vao postgreSQL
      dataUserMongo.map(async (x: UserDocument) => {
        await dataSyncPostgreSQL.validateAsync({
          username: x.username,
          userId: x._id.toString(),
          isActive: true,
        });

        await this.syncServiceForPostgreSQL.createUserPostgre({
          username: x.username,
          userId: x._id.toString(),
          isActive: true,
        });
      });
      return res.status(201).json(JsonResponse(false, 'Sync PostgreSQL Done'));
    } catch (e) {
      if (e.isJoi) {
        return res.status(422).json(JsonResponse(false, e.messages));
      }
    }
  }
}
