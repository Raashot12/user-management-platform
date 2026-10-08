import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserInfoEntity } from "./entities/user-info.entity";
import { UserContactEntity } from "./entities/user-contact.entity";
import { UserAddressEntity } from "./entities/user-address.entity";
import { UserAcademicEntity } from "./entities/user-academic.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserInfoEntity,
      UserContactEntity,
      UserAddressEntity,
      UserAcademicEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
