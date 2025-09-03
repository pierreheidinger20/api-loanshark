import { ConsoleLogger, Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonFeaturesModule, Config, JwtAuthGuard, RolesGuard } from 'common-features';
import { MongooseModule } from '@nestjs/mongoose'
import { Database } from './configuration/interfaces/database';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dataBaseConfig = configService.get<Database>('database');
        const uri = `${dataBaseConfig.url}/${dataBaseConfig.database}`;
        return { uri, ssl: dataBaseConfig.ssl };
      },
      inject: [ConfigService],
    }),
    RouterModule.register([
      {
        path: 'loans',
        module: LoansModule,
      }
    ]),
    LoansModule,
    CommonFeaturesModule
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
  ]
})
export class AppModule { }
