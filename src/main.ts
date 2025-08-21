import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter, LoggingInterceptor } from 'common-features';
import { ConsoleLogger, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const consoleLogger = app.get(ConsoleLogger);
  app.useGlobalFilters(new AllExceptionsFilter(consoleLogger));
  app.useGlobalInterceptors(new LoggingInterceptor(consoleLogger));
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();
  await app.listen(parseInt(process.env.PORT, 10) || 3001);
}
bootstrap();
