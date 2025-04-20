export interface RawCategory {
  id: string;
  label: string;
  parent_category_id: string | null;
  subCategories?: RawCategory[];
  created_at: Date;
  updated_at: Date;
  level?: number;
}
