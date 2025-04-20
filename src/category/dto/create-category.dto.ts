import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Music' })
  @IsDefined({ message: 'label is required' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ example: '9a3b1f3e-abe4-4b34-b8a3-69a09bd91fa0' })
  @IsUUID(4)
  @IsOptional()
  parentCategoryId: string | null;
}
