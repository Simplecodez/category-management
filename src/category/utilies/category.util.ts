import { plainToInstance } from 'class-transformer';
import { RawCategory } from '../interface/category.sql.interface';
import { Category } from '../entities/category.entity';

/**
 * Utility class for handling category-related operations.
 */
export class CategoryUtil {
  /**
   * Builds a tree structure of categories based on their parent-child relationships.
   * @param categories - The array of categories to build the tree from. It's typed as any[] because
   * @param parentCategoryId - The ID of the parent category to start building the tree from.
   * @return An array of categories with their subcategories.
   */

  static buildSubCategory(categories: RawCategory[], parentCategoryId: string) {
    return categories
      .filter((category) => category.parent_category_id === parentCategoryId)
      .map((category) => {
        const subCategories = this.buildSubCategory(categories, category.id);
        return {
          ...plainToInstance(Category, category),
          ...(subCategories.length > 0 && { subCategories })
        };
      });
  }

  static buildParentCategory(
    categories: RawCategory[],
    parentCategoryId: string
  ) {
    const subCategories = this.buildSubCategory(categories, parentCategoryId);
    const parentCategory = plainToInstance(
      Category,
      categories.find((category) => category.id === parentCategoryId)
    );
    parentCategory.subCategories = subCategories;
    return parentCategory;
  }
}
