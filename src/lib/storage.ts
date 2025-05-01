import { supabase } from './supabaseClient';

interface Ingredient {
  name: string;
  concerns?: string[];
  benefits?: string[];
}

interface SuitabilityNote {
  concern: string;
  explanation: string;
  recommendation?: string;
}

export interface ProductData {
  product_name: string;
  category: string;
  image_url: string;
  suitable_for?: string;
  health_score?: number;
  tags?: string[];
  summary?: string;
  ingredients?: Record<string, Ingredient>;
  suitability_notes?: Record<string, SuitabilityNote>;
}

export async function uploadProductImage(file: File): Promise<string> {
  try {
    // Create a unique filename using timestamp and original name
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${file.name.split('.')[0]}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        contentType: file.type // Set content type from the file object
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }

    if (!data) {
      throw new Error('No data returned from upload');
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    throw error;
  }
}

export async function createProductRecord(productData: ProductData): Promise<void> {
  try {
    const { error } = await supabase
      .from('product_health_assessments')
      .insert([{
        product_name: productData.product_name,
        category: productData.category,
        image_url: productData.image_url,
        suitable_for: productData.suitable_for || 'General',
        health_score: productData.health_score || 50,
        tags: productData.tags || [],
        summary: productData.summary || '',
        ingredients: productData.ingredients || {},
        suitability_notes: productData.suitability_notes || {},
        reviewed_by_ai: true,
        reviewed_by_human: false,
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Error creating product record:', error);
      throw new Error('Failed to create product record');
    }
  } catch (error) {
    console.error('Error in createProductRecord:', error);
    throw error;
  }
}