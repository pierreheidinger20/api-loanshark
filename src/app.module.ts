import { ConsoleLogger, Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CommonFeaturesModule,
  Config,
  JwtAuthGuard,
  RolesGuard,
} from 'common-features';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from './configuration/interfaces/database';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dataBaseConfig = configService.get<Database>('database');
        return {
          type: 'postgres',
          url: dataBaseConfig.url,
          host: dataBaseConfig.server,
          port: dataBaseConfig.port ? Number(dataBaseConfig.port) : 5432,
          username: dataBaseConfig.user,
          password: dataBaseConfig.password,
          database: dataBaseConfig.database,
          ssl: dataBaseConfig.ssl ? { rejectUnauthorized: dataBaseConfig.rejectUnauthorized !== false } : false,
          autoLoadEntities: true,
          synchronize: dataBaseConfig.synchronize === true,
        };
      },
      inject: [ConfigService],
    }),
    RouterModule.register([
      {
        path: 'loans',
        module: LoansModule,
      },
    ]),
    LoansModule,
    CommonFeaturesModule,
  ],
  providers: [
    ConsoleLogger,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
