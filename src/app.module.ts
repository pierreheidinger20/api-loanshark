import { ConsoleLogger, Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config, JwtAuthGuard, RolesGuard } from 'common-features';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Config],
    }),
    //example type Orm => need libraries to use
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const dataBaseConfig = configService.get<Database>('database');
    //     return {
    //       type: 'postgres',
    //       host: dataBaseConfig.server,
    //       port: dataBaseConfig.port,
    //       username: dataBaseConfig.user,
    //       password: dataBaseConfig.password,
    //       database: dataBaseConfig.database,
    //       entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //       synchronize: dataBaseConfig.synchronize,
    //       ssl: dataBaseConfig.ssl,
    //       extra: {
    //         ssl: {
    //           rejectUnauthorized: false,
    //         },
    //       },
    //     };
    //   },
    //   dataSourceFactory: async (options) => {
    //     const connection = await createConnection(options);
    //     return connection;
    //   },
    // }),

    //example mongoose => need libraries to use
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     const dataBaseConfig = configService.get<Database>('database');
    //     const uri = `mongodb+srv://${dataBaseConfig.user}:${dataBaseConfig.password}@${dataBaseConfig.server}/${dataBaseConfig.database}?retryWrites=true&w=majority`;
    //     return { uri  ,useNewUrlParser:true };
    //   },
    //   inject: [ConfigService],
    // }),
    RouterModule.register([
      // {
      //   path: 'auth',
      //   module: AuthModule,
      // }
    ])
  ],
  providers: [    
    ConsoleLogger,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ]
})
export class AppModule { }
