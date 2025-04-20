import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function RemoveCategoryApi() {
  return applyDecorators(
    ApiOperation({
      summary: 'Removes a category from the tree and it sub-categories'
    }),
    ApiParam({
      type: String,
      name: 'id',
      description: 'Parent category ID of the subtree to be removed',
      required: true
    }),
    ApiResponse({
      status: 204,
      description: 'Category removed successfully'
    })
  );
}
