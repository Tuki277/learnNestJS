import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CallSchema } from './schema/call.schema';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { CronService } from './call.cron.service';

@Module({
  imports: [SequelizeModule.forFeature([CallSchema])],
  controllers: [CallController],
  providers: [CallService, CronService],
})
export class CallModule {}
