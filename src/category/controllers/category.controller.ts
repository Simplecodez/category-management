import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { GetCategoryParamDto } from '../dto/get-category.param.dto';
import { GetCategoryQueryDto } from '../dto/get-category-query.dto';
import { RemoveCategoryApi } from '../decorators/swagger-docs/remove-category-api.decorator';
import { MoveSubTreeApi } from '../decorators/swagger-docs/move-subtree-api.decorator';
import { FetchCategorySubTreeApi } from '../decorators/swagger-docs/fetch-category-api.decorator';
import { AddCategoryApi } from '../decorators/swagger-docs/add-category-api.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @AddCategoryApi()
  async addCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.addCategory(createCategoryDto);

    return {
      status: 'success',
      data: {
        category
      }
    };
  }

  @Get(':id')
  @FetchCategorySubTreeApi()
  async fetchOneCategorySubTree(
    @Query() query: GetCategoryQueryDto,
    @Param() params: GetCategoryParamDto
  ) {
    const category = await this.categoryService.fetchOneCategorySubTree(
      params.id,
      query.treeDepth
    );

    return {
      status: 'success',
      data: {
        category
      }
    };
  }

  @Patch(':id')
  @MoveSubTreeApi()
  async moveSubTree(
    @Param() getCategoryParamDto: GetCategoryParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    const message = await this.categoryService.moveSubtree(
      getCategoryParamDto.id,
      updateCategoryDto
    );

    return {
      status: 'success',
      message
    };
  }

  @Delete(':id')
  @HttpCode(204)
  @RemoveCategoryApi()
  async removeCategory(@Param('id') id: string) {
    await this.categoryService.removeCategory(id);
    return;
  }
}
