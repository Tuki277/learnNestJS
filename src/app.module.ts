import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GetAccessTokenMiddleware } from './middlewares/getAccessToken.middleware';
import { AuthRoleMiddleware } from './middlewares/authRole.middleware';
import { CategoriesModule } from './categories/categories.module';
import { NewsModule } from './news/news.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { SyncModule } from './sync/sync.module';
import { CallModule } from './call/call.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from './wallet/wallet.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.HOST,
      port: parseInt(process.env.PORT),
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      autoLoadModels: true,
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRE_HOST,
      port: parseInt(process.env.POSTGRE_PORT),
      username: process.env.POSTGRE_USERNAME,
      password: process.env.POSTGRE_PASSWORD,
      database: process.env.POSTGRE_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      entities: ['**/*.entity{.ts,.js}'],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    CategoriesModule,
    NewsModule,
    SyncModule,
    CallModule,
    WalletModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(GetAccessTokenMiddleware)
      .forRoutes({ path: '/api/*', method: RequestMethod.ALL });
    consumer
      .apply(GetAccessTokenMiddleware)
      .forRoutes({ path: '/wallet', method: RequestMethod.ALL });
    consumer
      .apply(AuthRoleMiddleware)
      .forRoutes({ path: '/api/user', method: RequestMethod.ALL });
    consumer
      .apply(AuthRoleMiddleware)
      .forRoutes({ path: '/api/call', method: RequestMethod.ALL });
  }
}
