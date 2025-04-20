import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetCategoryParamDto {
  @ApiProperty({ example: 'dbabe16c-b4c4-47fb-be88-3274fb3c3ce8' })
  @IsUUID(4)
  id: string;
}
