import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Expose } from 'class-transformer';

@Entity()
@Unique('label_parent_category_uq', ['label', 'parentCategoryId'])
@Index('parent_category_id_idx', ['parentCategoryId']) // Index for faster lookups and speed up the deletion of subcategories
export class Category extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Expose({ name: 'parent_category_id' })
  @Column({ type: 'uuid', nullable: true })
  parentCategoryId: string | null;

  @ManyToOne(() => Category, (category) => category.subCategories, {
    nullable: true,
    // Deletes all subcategories when parent category is deleted. This was done to prevent any orphaned subcategories
    // that result from using:   onDelete: 'SET NULL'
    onDelete: 'CASCADE'
  })
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  subCategories: Category[];
}
