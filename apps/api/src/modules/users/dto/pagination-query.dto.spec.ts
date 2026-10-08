import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { PaginationQueryDto } from "./pagination-query.dto";

describe("PaginationQueryDto", () => {
  it("defaults to the first page with ten records", () => {
    const query = plainToInstance(PaginationQueryDto, {});

    expect(query.pageNumber).toBe(1);
    expect(query.pageSize).toBe(10);
    expect(validateSync(query)).toHaveLength(0);
  });

  it("transforms string query values into numbers", () => {
    const query = plainToInstance(PaginationQueryDto, {
      pageNumber: "2",
      pageSize: "25",
    });

    expect(query.pageNumber).toBe(2);
    expect(query.pageSize).toBe(25);
    expect(validateSync(query)).toHaveLength(0);
  });

  it("rejects page sizes above the supported maximum", () => {
    const query = plainToInstance(PaginationQueryDto, { pageSize: "101" });

    expect(validateSync(query).map((error) => error.property)).toContain("pageSize");
  });
});
