import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './modules/health/health.controller';
import { UsersModule } from './modules/users/users.module';
import { UserInfoEntity } from './modules/users/entities/user-info.entity';
import { UserContactEntity } from './modules/users/entities/user-contact.entity';
import { UserAddressEntity } from './modules/users/entities/user-address.entity';
import { UserAcademicEntity } from './modules/users/entities/user-academic.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.get<string>('DATABASE_URL'),
        entities: [UserInfoEntity, UserContactEntity, UserAddressEntity, UserAcademicEntity],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        migrationsRun: false,
        synchronize: false,
      }),
    }),
    UsersModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
