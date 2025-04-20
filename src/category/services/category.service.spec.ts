import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryUtil } from '../utilies/category.util';

describe('CategoryService', () => {
  let service: CategoryService;
  let repo: jest.Mocked<Repository<Partial<Category>>>;

  const mockCategory = {
    id: 'dbabe16c-b4c4-47fb-be88-3274fb3c3ce8',
    label: 'Music',
    parentCategoryId: '25f28b81-e064-4933-954b-b3091c791f12',
    subCategories: [],
    createdAt: new Date('2025-04-20T06:51:26.577Z'),
    updatedAt: new Date('2025-04-20T06:51:26.577Z')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            query: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repo = module.get(getRepositoryToken(Category));
  });

  describe('addCategory', () => {
    it('should add and return a category', async () => {
      const dto: CreateCategoryDto = {
        label: 'Music',
        parentCategoryId: null
      };

      repo.create.mockReturnValue(mockCategory);
      repo.save.mockResolvedValue(mockCategory);

      const result = await service.addCategory(dto);
      expect(result).toEqual(mockCategory);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockCategory);
    });
  });

  describe('fetchOneCategorySubTree', () => {
    it('should return category subtree if found', async () => {
      repo.query.mockResolvedValue([mockCategory]);
      jest
        .spyOn(CategoryUtil, 'buildParentCategory')
        .mockReturnValue(mockCategory as any);

      const result = await service.fetchOneCategorySubTree(mockCategory.id, 3);
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.query.mockResolvedValue([]);

      await expect(
        service.fetchOneCategorySubTree('non-existent-uuid', 3)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('moveSubtree', () => {
    it('should move a subtree successfully', async () => {
      const dto: UpdateCategoryDto = {
        newParentCategoryId: '2e935648-f8b9-4c21-8e88-00b631d6e3e2'
      };

      repo.findOne.mockResolvedValue({
        id: dto.newParentCategoryId
      } as Category);
      repo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.moveSubtree(mockCategory.id, dto);
      expect(result).toBe('Subcategory moved successfully');
    });

    it('should throw if new parent not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        service.moveSubtree(mockCategory.id, {
          newParentCategoryId: 'invalid-uuid'
        })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if update affected 0 rows', async () => {
      repo.findOne.mockResolvedValue({ id: 'valid-uuid' } as Category);
      repo.update.mockResolvedValue({ affected: 0 } as any);

      await expect(
        service.moveSubtree(mockCategory.id, {
          newParentCategoryId: 'valid-uuid'
        })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeCategory', () => {
    it('should delete category successfully', async () => {
      repo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.removeCategory(mockCategory.id);
      expect(result).toBeUndefined();
    });

    it('should throw if delete affected 0 rows', async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.removeCategory(mockCategory.id)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
