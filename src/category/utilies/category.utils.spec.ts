import { CategoryUtil } from './category.util';
import { RawCategory } from '../interface/category.sql.interface';
import { Category } from '../entities/category.entity';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

// Mock UUID for test consistency
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('123e4567-e89b-12d3-a456-426614174000')
}));

jest.mock('class-transformer', () => ({
  ...jest.requireActual('class-transformer'),
  plainToInstance: jest.fn((cls, obj) => ({ ...obj }))
}));

describe('CategoryUtil', () => {
  const mockDate = new Date('2025-01-01T00:00:00Z');

  const categories: RawCategory[] = [
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      label: 'Rock',
      parent_category_id: 'null',
      created_at: mockDate,
      updated_at: mockDate
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174002',
      label: 'Classic Rock',
      parent_category_id: '123e4567-e89b-12d3-a456-426614174001',
      created_at: mockDate,
      updated_at: mockDate
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174003',
      label: 'Alternative Rock',
      parent_category_id: '123e4567-e89b-12d3-a456-426614174001',
      created_at: mockDate,
      updated_at: mockDate
    }
  ];

  describe('buildSubCategory', () => {
    it('should build subcategory tree starting from "Music" category', () => {
      const subtree = CategoryUtil.buildSubCategory(
        categories,
        '123e4567-e89b-12d3-a456-426614174001'
      );
      expect(subtree).toEqual([
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          label: 'Classic Rock',
          parent_category_id: '123e4567-e89b-12d3-a456-426614174001',
          created_at: mockDate,
          updated_at: mockDate
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          label: 'Alternative Rock',
          parent_category_id: '123e4567-e89b-12d3-a456-426614174001',
          created_at: mockDate,
          updated_at: mockDate
        }
      ]);
    });
  });

  describe('buildParentCategory', () => {
    it('should build the parent category with subtree', () => {
      const result = CategoryUtil.buildParentCategory(
        categories,
        '123e4567-e89b-12d3-a456-426614174001'
      );
      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174001',
        label: 'Rock',
        parent_category_id: 'null',
        created_at: mockDate,
        updated_at: mockDate,
        subCategories: [
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            label: 'Classic Rock',
            parent_category_id: '123e4567-e89b-12d3-a456-426614174001',
            created_at: mockDate,
            updated_at: mockDate
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174003',
            label: 'Alternative Rock',
            parent_category_id: '123e4567-e89b-12d3-a456-426614174001',
            created_at: mockDate,
            updated_at: mockDate
          }
        ]
      });
    });
  });
});
