import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserInfoEntity } from "./user-info.entity";

@Entity("UserAcademicsTB")
export class UserAcademicEntity {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column({ type: "uuid" }) userInfoId: string;
  @Column({ type: "varchar", length: 200 }) schoolName: string;
  @Column({ type: "varchar", length: 120, nullable: true }) qualification:
    | string
    | null;
  @Column({ type: "varchar", length: 160, nullable: true }) fieldOfStudy:
    | string
    | null;
  @Column({ type: "date", nullable: true }) startDate: string | null;
  @Column({ type: "date", nullable: true }) endDate: string | null;
  @ManyToOne(() => UserInfoEntity, (user) => user.academics, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userInfoId" })
  user: UserInfoEntity;
}
