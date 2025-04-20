import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'dbabe16c-b4c4-47fb-be88-3274fb3c3ce8' })
  @IsDefined({ message: 'newParentCategoryId is required' })
  @IsUUID(4)
  newParentCategoryId: string;
}
