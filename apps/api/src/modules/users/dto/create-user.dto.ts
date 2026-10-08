import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsUrl, Matches, MinLength, ValidateNested } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Gender } from "../entities/user-info.entity";

export class UserInfoDto {
  @ApiPropertyOptional({ description: "Profile photo URL", format: "uri", example: "https://example.com/photo.jpg" })
  @IsOptional() @IsUrl() profilePhotoUrl?: string;
  @ApiProperty({ example: "Ada" })
  @IsString() @MinLength(2) firstName: string;
  @ApiProperty({ example: "Okafor" })
  @IsString() @MinLength(2) lastName: string;
  @ApiProperty({ type: String, format: "date", example: "1994-06-15" })
  @IsDateString() dob: string;
  @ApiProperty({ example: "Software Engineer" })
  @IsString() @MinLength(2) occupation: string;
  @ApiProperty({ enum: Gender, example: Gender.FEMALE })
  @IsEnum(Gender) gender: Gender;
}

export class UserContactDto {
  @ApiProperty({ example: "ada@example.com" })
  @IsEmail() email: string;
  @ApiProperty({ example: "+2348012345678", description: "International format, digits with an optional leading +" })
  @Matches(/^\+?[1-9]\d{7,14}$/) phoneNumber: string;
  @ApiPropertyOptional({ example: "+234-1-555-0100" })
  @IsOptional() @IsString() fax?: string;
  @ApiPropertyOptional({ format: "uri", example: "https://www.linkedin.com/in/ada" })
  @IsOptional() @IsUrl() linkedInUrl?: string;
}

export class UserAddressDto {
  @ApiProperty({ example: "12 Marina Road" })
  @IsString() @MinLength(3) address: string;
  @ApiProperty({ example: "Lagos" })
  @IsString() city: string;
  @ApiProperty({ example: "Lagos" })
  @IsString() state: string;
  @ApiProperty({ example: "Nigeria" })
  @IsString() country: string;
  @ApiProperty({ example: "101001" })
  @IsString() zipCode: string;
}

export class SchoolDto {
  @ApiProperty({ example: "University of Lagos" })
  @IsString() @MinLength(2) schoolName: string;
  @ApiPropertyOptional({ example: "B.Sc." })
  @IsOptional() @IsString() qualification?: string;
  @ApiPropertyOptional({ example: "Computer Science" })
  @IsOptional() @IsString() fieldOfStudy?: string;
  @ApiPropertyOptional({ type: String, format: "date", example: "2012-09-01" })
  @IsOptional() @IsDateString() startDate?: string;
  @ApiPropertyOptional({ type: String, format: "date", example: "2016-06-30" })
  @IsOptional() @IsDateString() endDate?: string;
}

export class UserAcademicsDto {
  @ApiProperty({ type: [SchoolDto], description: "Past schools to add to this user's academic history" })
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => SchoolDto)
  schools: SchoolDto[];
}
