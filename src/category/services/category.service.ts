import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { FIND_CATEGORY_WITH_SUBTREE } from '../queries/category.query';
import { CategoryUtil } from '../utilies/category.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  addCategory(createCategoryDto: CreateCategoryDto) {
    const { parentCategoryId, label } = createCategoryDto;

    const category = this.categoryRepository.create({
      parentCategoryId,
      label
    });

    return this.categoryRepository.save(category);
  }

  /**
   * Fetches the subtree of a parent category.
   *
   * @param parentCategoryId
   * @query treeDepth
   * @returns The category subtree.
   * @throws NotFoundException if the category is not found.
   * @remarks
   * It uses PostgreSQL's recursive CTE to fetch the category and its subcategories.
   * This was done to avoid the N+1 problem which involves make round trips
   * to the database recursively to fetch the subcategories.
   * Another option I considered, was creating a closure table to store the
   * relationship between parent and sub categories, but that would have some
   * performance issue when adding categories as we have to account for its
   * predecessors and also insert new parent off of them in the DB before add the new category.
   * This leads to more DB storage usage.
   * Recursive CTE with a depth limit is a good trade off because we don't have
   * to create make recursive round trips to the DB and writing is pretty fast.
   * So, I introduced the treeDepth parameter to control the number of recursions the DB has make.
   */
  async fetchOneCategorySubTree(
    parentCategoryId: string,
    treeDepth: number = 5
  ): Promise<Category> {
    const categories = await this.categoryRepository.query(
      FIND_CATEGORY_WITH_SUBTREE,
      [parentCategoryId, treeDepth]
    );

    if (categories.length === 0) {
      throw new NotFoundException('Category not found');
    }

    return CategoryUtil.buildParentCategory(categories, parentCategoryId);
  }

  async moveSubtree(subTreeId: string, updateCategoryDto: UpdateCategoryDto) {
    const { newParentCategoryId } = updateCategoryDto;

    const newParentCategory = await this.categoryRepository.findOne({
      where: { id: newParentCategoryId }
    });

    if (!newParentCategory)
      throw new NotFoundException('New parent category not found');

    const updateResult = await this.categoryRepository.update(
      { id: subTreeId },
      { parentCategoryId: newParentCategoryId }
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException('Subcategory not found');
    }

    return 'Subcategory moved successfully';
  }

  async removeCategory(id: string) {
    const deleteResult = await this.categoryRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Category not found');
    }
  }
}
