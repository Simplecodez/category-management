import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateCategoryDto } from './../../dto/update-category.dto';

export function MoveSubTreeApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Move one subtree from one parent to another' }),
    ApiParam({
      type: String,
      name: 'id',
      description: 'Parent category ID of the subtree to be moved',
      required: true
    }),
    ApiBody({
      type: UpdateCategoryDto,
      description: 'Contains newParentCategoryId, the new parent category ID',
      required: true
    }),
    ApiResponse({
      status: 200,
      description: 'Subtree moved successfully',
      schema: {
        example: {
          status: 'success',
          message: 'Subtree moved successfully'
        }
      }
    })
  );
}
