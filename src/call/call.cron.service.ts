import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CallSchema } from './schema/call.schema';
import { QueryTypes } from 'sequelize';
import { UserMySQLSchema } from 'src/user/schemas/userMySQL.schema';
import { CallService } from './call.service';

@Injectable()
export class CronService {
  constructor(
    @InjectModel(CallSchema)
    private callModel: typeof CallSchema,
    private callService: CallService,
  ) {}

  @Cron('0 0 9 * * 1-6')
  // @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    try {
      const date = new Date().toISOString().split('T')[0];
      const dataResult: UserMySQLSchema[] =
        await this.callModel.sequelize.query(
          `Select * from UserMySQLSchemas
             WHERE userId NOT IN (SELECT userId from CallSchemas WHERE createdAt BETWEEN '${date} 00:00:00' AND '${date} 23:59:00' )`,
          { type: QueryTypes.SELECT },
        );

      if (dataResult) {
        dataResult.map(async (x) => {
          this.callService.createCall({
            username: x.fullname,
            userId: x.userId,
            isCall: false,
          });
        });
        console.log('cron done');
      }
      console.log('not data cron');
    } catch (error) {
      console.log(error.message);
    }
  }
}
