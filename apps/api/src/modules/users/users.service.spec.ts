import { DataSource } from "typeorm";
import { UsersService } from "./users.service";
import { UserInfoEntity } from "./entities/user-info.entity";

describe("UsersService.findAll", () => {
  const findAndCount = jest.fn();
  const repository = { findAndCount };
  const dataSource = {
    getRepository: jest.fn().mockReturnValue(repository),
  } as unknown as DataSource;

  let service: UsersService;

  beforeEach(() => {
    findAndCount.mockReset();
    dataSource.getRepository = jest.fn().mockReturnValue(repository);
    service = new UsersService(dataSource);
  });

  it("loads the requested page with user relations and returns pagination metadata", async () => {
    const users = [{ id: "user-1" }, { id: "user-2" }] as UserInfoEntity[];
    findAndCount.mockResolvedValue([users, 23]);

    const result = await service.findAll(3, 10);

    expect(dataSource.getRepository).toHaveBeenCalledWith(UserInfoEntity);
    expect(findAndCount).toHaveBeenCalledWith({
      relations: { contact: true, address: true, academics: true },
      order: { createdAt: "DESC" },
      skip: 20,
      take: 10,
    });
    expect(result).toEqual({
      items: users,
      pageNumber: 3,
      pageSize: 10,
      totalCount: 23,
      totalPages: 3,
    });
  });

  it("returns an empty page with zero total pages when there are no users", async () => {
    findAndCount.mockResolvedValue([[], 0]);

    const result = await service.findAll(1, 10);

    expect(result).toEqual({
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
    });
  });
});
