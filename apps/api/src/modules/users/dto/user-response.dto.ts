import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "../entities/user-info.entity";

export class UserContactResponseDto {
  @ApiProperty({ format: "uuid" }) id: string;
  @ApiProperty({ format: "uuid" }) userInfoId: string;
  @ApiProperty({ example: "ada@example.com" }) email: string;
  @ApiProperty({ example: "+2348012345678" }) phoneNumber: string;
  @ApiProperty({ type: String, nullable: true }) fax: string | null;
  @ApiProperty({ type: String, format: "uri", nullable: true }) linkedInUrl: string | null;
}

export class UserAddressResponseDto {
  @ApiProperty({ format: "uuid" }) id: string;
  @ApiProperty({ format: "uuid" }) userInfoId: string;
  @ApiProperty() address: string;
  @ApiProperty() city: string;
  @ApiProperty() state: string;
  @ApiProperty() country: string;
  @ApiProperty() zipCode: string;
}

export class UserAcademicResponseDto {
  @ApiProperty({ format: "uuid" }) id: string;
  @ApiProperty({ format: "uuid" }) userInfoId: string;
  @ApiProperty() schoolName: string;
  @ApiProperty({ type: String, nullable: true }) qualification: string | null;
  @ApiProperty({ type: String, nullable: true }) fieldOfStudy: string | null;
  @ApiProperty({ type: String, format: "date", nullable: true }) startDate: string | null;
  @ApiProperty({ type: String, format: "date", nullable: true }) endDate: string | null;
}

export class UserResponseDto {
  @ApiProperty({ format: "uuid" }) id: string;
  @ApiProperty({ type: String, format: "uri", nullable: true }) profilePhotoUrl: string | null;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty({ type: String, format: "date" }) dob: string;
  @ApiProperty() occupation: string;
  @ApiProperty({ enum: Gender }) gender: Gender;
  @ApiProperty({ type: String, format: "date-time" }) createdAt: Date;
  @ApiProperty({ type: String, format: "date-time" }) updatedAt: Date;
  @ApiProperty({ type: UserContactResponseDto, nullable: true }) contact: UserContactResponseDto | null;
  @ApiProperty({ type: UserAddressResponseDto, nullable: true }) address: UserAddressResponseDto | null;
  @ApiProperty({ type: [UserAcademicResponseDto] }) academics: UserAcademicResponseDto[];
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto] }) items: UserResponseDto[];
  @ApiProperty({ example: 1 }) pageNumber: number;
  @ApiProperty({ example: 10 }) pageSize: number;
  @ApiProperty({ example: 42 }) totalCount: number;
  @ApiProperty({ example: 5 }) totalPages: number;
}
