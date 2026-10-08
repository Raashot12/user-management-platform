import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { UserInfoEntity } from '../modules/users/entities/user-info.entity';
import { UserContactEntity } from '../modules/users/entities/user-contact.entity';
import { UserAddressEntity } from '../modules/users/entities/user-address.entity';
import { UserAcademicEntity } from '../modules/users/entities/user-academic.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [UserInfoEntity, UserContactEntity, UserAddressEntity, UserAcademicEntity],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
