import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1750000000000 implements MigrationInterface {
  name = 'CreateUsers1750000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE TYPE "public"."UserInfoTB_gender_enum" AS ENUM('MALE','FEMALE','OTHER','PREFER_NOT_TO_SAY')`);
    await queryRunner.query(`CREATE TABLE "UserInfoTB" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profilePhotoUrl" character varying,
      "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL,
      "dob" date NOT NULL, "occupation" character varying(160) NOT NULL,
      "gender" "public"."UserInfoTB_gender_enum" NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_UserInfoTB_id" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "UserContactTB" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userInfoId" uuid NOT NULL,
      "email" character varying(254) NOT NULL, "phoneNumber" character varying(20) NOT NULL,
      "fax" character varying, "linkedInUrl" character varying,
      CONSTRAINT "PK_UserContactTB_id" PRIMARY KEY ("id"), CONSTRAINT "UQ_UserContactTB_user" UNIQUE ("userInfoId"),
      CONSTRAINT "UQ_UserContactTB_email" UNIQUE ("email"))`);
    await queryRunner.query(`CREATE TABLE "UserAddressTB" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userInfoId" uuid NOT NULL,
      "address" character varying(240) NOT NULL, "city" character varying(100) NOT NULL,
      "state" character varying(100) NOT NULL, "country" character varying(100) NOT NULL,
      "zipCode" character varying(24) NOT NULL,
      CONSTRAINT "PK_UserAddressTB_id" PRIMARY KEY ("id"), CONSTRAINT "UQ_UserAddressTB_user" UNIQUE ("userInfoId"))`);
    await queryRunner.query(`CREATE TABLE "UserAcademicsTB" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userInfoId" uuid NOT NULL,
      "schoolName" character varying(200) NOT NULL, "qualification" character varying(120),
      "fieldOfStudy" character varying(160), "startDate" date, "endDate" date,
      CONSTRAINT "PK_UserAcademicsTB_id" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "UserContactTB" ADD CONSTRAINT "FK_UserContactTB_user" FOREIGN KEY ("userInfoId") REFERENCES "UserInfoTB"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "UserAddressTB" ADD CONSTRAINT "FK_UserAddressTB_user" FOREIGN KEY ("userInfoId") REFERENCES "UserInfoTB"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "UserAcademicsTB" ADD CONSTRAINT "FK_UserAcademicsTB_user" FOREIGN KEY ("userInfoId") REFERENCES "UserInfoTB"("id") ON DELETE CASCADE`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "UserAcademicsTB" DROP CONSTRAINT "FK_UserAcademicsTB_user"`);
    await queryRunner.query(`ALTER TABLE "UserAddressTB" DROP CONSTRAINT "FK_UserAddressTB_user"`);
    await queryRunner.query(`ALTER TABLE "UserContactTB" DROP CONSTRAINT "FK_UserContactTB_user"`);
    await queryRunner.query(`DROP TABLE "UserAcademicsTB"`);
    await queryRunner.query(`DROP TABLE "UserAddressTB"`);
    await queryRunner.query(`DROP TABLE "UserContactTB"`);
    await queryRunner.query(`DROP TABLE "UserInfoTB"`);
    await queryRunner.query(`DROP TYPE "public"."UserInfoTB_gender_enum"`);
  }
}
