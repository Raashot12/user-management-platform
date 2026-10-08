import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserInfoEntity } from "./user-info.entity";

@Entity("UserContactTB")
export class UserContactEntity {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column({ type: "uuid", unique: true }) userInfoId: string;
  @Column({ type: "varchar", length: 254, unique: true }) email: string;
  @Column({ type: "varchar", length: 20 }) phoneNumber: string;
  @Column({ type: "varchar", nullable: true }) fax: string | null;
  @Column({ type: "varchar", nullable: true }) linkedInUrl: string | null;
  @OneToOne(() => UserInfoEntity, (user) => user.contact, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userInfoId" })
  user: UserInfoEntity;
}
