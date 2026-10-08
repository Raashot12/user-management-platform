import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserInfoEntity } from "./user-info.entity";

@Entity("UserAddressTB")
export class UserAddressEntity {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column({ type: "uuid", unique: true }) userInfoId: string;
  @Column({ type: "varchar", length: 240 }) address: string;
  @Column({ type: "varchar", length: 100 }) city: string;
  @Column({ type: "varchar", length: 100 }) state: string;
  @Column({ type: "varchar", length: 100 }) country: string;
  @Column({ type: "varchar", length: 24 }) zipCode: string;
  @OneToOne(() => UserInfoEntity, (user) => user.address, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userInfoId" })
  user: UserInfoEntity;
}
