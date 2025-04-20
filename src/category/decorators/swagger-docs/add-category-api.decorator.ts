import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto } from './../../dto/create-category.dto';
export function AddCategoryApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Add a new category' }),
    ApiBody({
      type: CreateCategoryDto,
      required: true,
      description: 'Data required to create a new category'
    }),
    ApiResponse({
      status: 201,
      description: 'Category added successfully',
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
              subCategories: []
            }
          }
        }
      }
    })
  );
}
