import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class PaginationQueryDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1, description: "One-based page number" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber: number = 1;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 10;
}
