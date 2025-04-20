import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetCategoryQueryDto {
  @ApiProperty({ example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2)
  @Max(5)
  treeDepth?: number;
}
