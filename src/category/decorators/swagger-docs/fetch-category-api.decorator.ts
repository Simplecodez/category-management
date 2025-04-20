import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function FetchCategorySubTreeApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Fetch one category subtree' }),
    ApiQuery({
      type: Number,
      name: 'treeDepth',
      required: false,
      description: 'Depth of the category tree to fetch'
    }),
    ApiParam({
      type: String,
      name: 'id',
      description: 'Parent category ID of the subtree to be fetched',
      required: true
    }),
    ApiResponse({
      status: 200,
      description: 'Category subtree fetch successfully',
      schema: {
        example: {
          status: 'success',
          data: {
            category: {
              id: '9a3b1f3e-abe4-4b34-b8a3-69a09bd91fa0',
              label: 'Music',
              parentCategoryId: null,
              createdAt: '2023-10-01T12:00:00.000Z',
              updatedAt: '2023-10-01T12:00:00.000Z',

              subCategories: [
                {
                  id: '2a3b1f3e-abe4-4b34-b8a3-69ae9bd91fa0',
                  label: 'Opera',
                  parentCategoryId: '9a3b1f3e-abe4-4b34-b8a3-69a09bd91fa0',
                  createdAt: '2023-10-01T12:00:00.000Z',
                  updatedAt: '2023-10-01T12:00:00.000Z',
                  subCategories: []
                }
              ]
            }
          }
        }
      }
    })
  );
}
