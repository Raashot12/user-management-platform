import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, EntityManager } from "typeorm";
import { UserAcademicsDto, UserAddressDto, UserContactDto, UserInfoDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserInfoEntity } from "./entities/user-info.entity";
import { UserContactEntity } from "./entities/user-contact.entity";
import { UserAddressEntity } from "./entities/user-address.entity";
import { UserAcademicEntity } from "./entities/user-academic.entity";

const relations = { contact: true, address: true, academics: true } as const;

@Injectable()
export class UsersService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createUserInfo(dto: UserInfoDto) {
    const user = await this.dataSource.getRepository(UserInfoEntity).save(dto);
    return this.findOne(user.id);
  }

  async addContact(id: string, dto: UserContactDto) {
    return this.dataSource.transaction(async (manager) => {
      await this.requireUser(id, manager);
      const contacts = manager.getRepository(UserContactEntity);
      if (await contacts.findOneBy({ userInfoId: id })) {
        throw new ConflictException("This user already has contact information");
      }
      await contacts.save({ ...dto, userInfoId: id });
      return this.findOneWithManager(id, manager);
    });
  }

  async addAddress(id: string, dto: UserAddressDto) {
    return this.dataSource.transaction(async (manager) => {
      await this.requireUser(id, manager);
      const addresses = manager.getRepository(UserAddressEntity);
      if (await addresses.findOneBy({ userInfoId: id })) {
        throw new ConflictException("This user already has an address");
      }
      await addresses.save({ ...dto, userInfoId: id });
      return this.findOneWithManager(id, manager);
    });
  }

  async addAcademics(id: string, dto: UserAcademicsDto) {
    return this.dataSource.transaction(async (manager) => {
      await this.requireUser(id, manager);
      const schools = dto.schools.map((school) => manager.create(UserAcademicEntity, { ...school, userInfoId: id }));
      await manager.save(UserAcademicEntity, schools);
      return this.findOneWithManager(id, manager);
    });
  }

  async findAll(pageNumber: number, pageSize: number) {
    const [items, totalCount] = await this.dataSource.getRepository(UserInfoEntity).findAndCount({
      relations,
      order: { createdAt: "DESC" },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    return { items, pageNumber, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) };
  }

  async findOne(id: string) {
    const user = await this.dataSource.getRepository(UserInfoEntity).findOne({ where: { id }, relations });
    if (!user) throw new NotFoundException(`User ${id} was not found`);
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(UserInfoEntity);
      const user = await users.findOne({ where: { id }, relations });
      if (!user) throw new NotFoundException(`User ${id} was not found`);
      if (dto.userInfo) await users.save({ ...user, ...dto.userInfo });
      if (dto.userContact) {
        await manager.getRepository(UserContactEntity).save({ ...user.contact, ...dto.userContact, userInfoId: id });
      }
      if (dto.userAddress) {
        await manager.getRepository(UserAddressEntity).save({ ...user.address, ...dto.userAddress, userInfoId: id });
      }
      if (dto.userAcademics) {
        await manager.getRepository(UserAcademicEntity).delete({ userInfoId: id });
        const schools = dto.userAcademics.schools.map((school) => manager.create(UserAcademicEntity, { ...school, userInfoId: id }));
        if (schools.length) await manager.save(UserAcademicEntity, schools);
      }
      return this.findOneWithManager(id, manager);
    });
  }

  async remove(id: string) {
    const result = await this.dataSource.getRepository(UserInfoEntity).delete(id);
    if (!result.affected) throw new NotFoundException(`User ${id} was not found`);
    return { deleted: true, id };
  }

  private async requireUser(id: string, manager: EntityManager) {
    const user = await manager.getRepository(UserInfoEntity).findOneBy({ id });
    if (!user) throw new NotFoundException(`User ${id} was not found`);
    return user;
  }

  private async findOneWithManager(id: string, manager: EntityManager) {
    const user = await manager.getRepository(UserInfoEntity).findOne({ where: { id }, relations });
    if (!user) throw new NotFoundException(`User ${id} was not found`);
    return user;
  }
}


