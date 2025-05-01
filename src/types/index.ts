export interface Product {
  id: string;
  image_url: string;
  product_name: string;
  health_score: number;
  category: string;
  suitable_for: string;
}

export interface DetailedProduct extends Product {
  source_url: string;
  ingredients: Record<string, string>;
  summary: string;
  careful_note: string;
  detailed_reason: string;
  suitability_notes: Record<string, string>;
  reviewed_by_ai: boolean;
  reviewed_by_human: boolean;
  created_at: string;
}

export interface Filter {
  id: string;
  label: string;
  type: 'category' | 'suitable_for';
}