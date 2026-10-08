import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { UserAcademicsDto, UserAddressDto, UserContactDto, UserInfoDto } from "./create-user.dto";

export class UpdateUserInfoDto extends PartialType(UserInfoDto) {}
export class UpdateUserContactDto extends PartialType(UserContactDto) {}
export class UpdateUserAddressDto extends PartialType(UserAddressDto) {}

export class UpdateUserDto {
  @ApiPropertyOptional({ type: UpdateUserInfoDto })
  @IsOptional() @ValidateNested() @Type(() => UpdateUserInfoDto)
  userInfo?: UpdateUserInfoDto;

  @ApiPropertyOptional({ type: UpdateUserContactDto })
  @IsOptional() @ValidateNested() @Type(() => UpdateUserContactDto)
  userContact?: UpdateUserContactDto;

  @ApiPropertyOptional({ type: UpdateUserAddressDto })
  @IsOptional() @ValidateNested() @Type(() => UpdateUserAddressDto)
  userAddress?: UpdateUserAddressDto;

  @ApiPropertyOptional({ type: UserAcademicsDto, description: "Replace the user's academic history" })
  @IsOptional() @ValidateNested() @Type(() => UserAcademicsDto)
  userAcademics?: UserAcademicsDto;
}
