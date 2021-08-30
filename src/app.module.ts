import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './models/cards/cards.module';
import configuration from './config/configuration';

@Module({
  imports: [
    CardsModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const {
          host,
          port,
          database,
          username,
          password,
          type,
          synchronize,
          migrationsRun,
        } = configService.get('database');
        return {
          type,
          host,
          port,
          database,
          username,
          password,
          synchronize,
          migrationsRun,
          entities: ['dist/**/*.entity.js'],
          migrations: ['dist/migration/*.js'],
          namingStrategy: new SnakeNamingStrategy(),
          cli: {
            migrationsDir: 'migration',
          },
          migrationsTableName: 'migrations',
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
