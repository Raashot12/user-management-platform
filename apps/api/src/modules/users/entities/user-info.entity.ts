import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserContactEntity } from "./user-contact.entity";
import { UserAddressEntity } from "./user-address.entity";
import { UserAcademicEntity } from "./user-academic.entity";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

@Entity("UserInfoTB")
export class UserInfoEntity {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column({ type: "varchar", nullable: true }) profilePhotoUrl: string | null;
  @Column({ type: "varchar", length: 100 }) firstName: string;
  @Column({ type: "varchar", length: 100 }) lastName: string;
  @Column({ type: "date" }) dob: string;
  @Column({ type: "varchar", length: 160 }) occupation: string;
  @Column({ type: "enum", enum: Gender }) gender: Gender;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @OneToOne(() => UserContactEntity, (contact) => contact.user, {
    cascade: false,
  })
  contact: UserContactEntity;
  @OneToOne(() => UserAddressEntity, (address) => address.user, {
    cascade: false,
  })
  address: UserAddressEntity;
  @OneToMany(() => UserAcademicEntity, (academic) => academic.user)
  academics: UserAcademicEntity[];
}
