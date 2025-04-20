import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from '../services/category.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { GetCategoryParamDto } from '../dto/get-category.param.dto';
import { GetCategoryQueryDto } from '../dto/get-category-query.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategoryService = {
    addCategory: jest.fn(),
    fetchOneCategorySubTree: jest.fn(),
    moveSubtree: jest.fn(),
    removeCategory: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService
        }
      ]
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('addCategory', () => {
    it('should add a category and return response', async () => {
      const dto: CreateCategoryDto = {
        label: 'Test Category',
        parentCategoryId: null
      };
      const result = { ...dto };
      mockCategoryService.addCategory.mockResolvedValue(result);

      const response = await controller.addCategory(dto);

      expect(service.addCategory).toHaveBeenCalledWith(dto);
      expect(response).toEqual({
        status: 'success',
        data: { category: result }
      });
    });

    it('should handle HttpException correctly', async () => {
      const error = new HttpException(
        {
          status: 'fail',
          statusCode: HttpStatus.BAD_REQUEST
        },
        HttpStatus.BAD_REQUEST
      );

      mockCategoryService.addCategory.mockRejectedValue(error);
      try {
        await controller.addCategory({} as any);
      } catch (error: any) {
        expect(error.response.status).toBe('fail');
        expect(error.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('fetchOneCategorySubTree', () => {
    it('should fetch a category subtree and return response', async () => {
      const query: GetCategoryQueryDto = { treeDepth: 2 };
      const params: GetCategoryParamDto = {
        id: '1c4e2f78-b8d1-4e42-a4a7-5b2df6efb4c2'
      };
      const mockResult = { id: params.id, label: 'Music' };
      mockCategoryService.fetchOneCategorySubTree.mockResolvedValue(mockResult);

      const response = await controller.fetchOneCategorySubTree(query, params);

      expect(service.fetchOneCategorySubTree).toHaveBeenCalledWith(
        params.id,
        2
      );
      expect(response).toEqual({
        status: 'success',
        data: { category: mockResult }
      });
    });
  });

  describe('moveSubTree', () => {
    it('should move a subtree and return success message', async () => {
      const paramDto: GetCategoryParamDto = {
        id: 'e6ff3772-7a76-4c1a-8652-6e9e661b432b'
      };
      const updateDto: UpdateCategoryDto = {
        newParentCategoryId: 'c7b3d91a-e064-11ee-a56c-0242ac120002'
      };
      const message = 'Subtree moved successfully';
      mockCategoryService.moveSubtree.mockResolvedValue(message);

      const response = await controller.moveSubTree(paramDto, updateDto);

      expect(service.moveSubtree).toHaveBeenCalledWith(paramDto.id, updateDto);
      expect(response).toEqual({
        status: 'success',
        message
      });
    });
  });

  describe('removeCategory', () => {
    it('should remove a category and return void', async () => {
      const id = 'fb0e7ff1-ef94-4e41-bc2e-4b60b53c6677';
      mockCategoryService.removeCategory.mockResolvedValue(undefined);

      const result = await controller.removeCategory(id);

      expect(service.removeCategory).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
