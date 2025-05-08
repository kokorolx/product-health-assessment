import { DetailedProduct } from '@/types';
import { supabase } from './supabaseClient';

const DEFAULT_LIMIT = 20;

export async function getProducts(page: number = 1, limit: number = DEFAULT_LIMIT): Promise<DetailedProduct[]> {
  try {
    const offset = (page - 1) * limit;
    const { data, error } = await supabase
      .from('product_health_assessments')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data as DetailedProduct[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getUniqueCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('product_health_assessments')
      .select('category');

    if (error) {
      console.error('Error fetching unique categories:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    const categories = data
      .map(item => item.category)
      .filter(category => category !== null && category !== undefined && category.trim() !== '');

    return Array.from(new Set(categories)).sort();
  } catch (error) {
    console.error('Error fetching unique categories:', error);
    throw error;
  }
}

export async function getUniqueSuitableFor(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('product_health_assessments')
      .select('suitable_for');

    if (error) {
      console.error('Error fetching unique suitable_for values:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    const suitableForValues = data
      .map(item => item.suitable_for)
      .filter(value => value !== null && value !== undefined && value.trim() !== '');

    return Array.from(new Set(suitableForValues)).sort();
  } catch (error) {
    console.error('Error fetching unique suitable_for values:', error);
    throw error;
  }
}

export async function getFilteredProducts(activeFilters: string[], page: number = 1, limit: number = DEFAULT_LIMIT): Promise<DetailedProduct[]> {
  try {
    const offset = (page - 1) * limit;

    // If no filters are active, return paginated products
    if (activeFilters.length === 0) {
      return getProducts(page, limit);
    }

    // Start building the query
    let query = supabase
      .from('product_health_assessments')
      .select('*');

    // Separate filters by type
    const categoryFilters = activeFilters
      .filter(f => f.startsWith('category:'))
      .map(f => f.replace('category:', ''));

    const suitableForFilters = activeFilters
      .filter(f => f.startsWith('suitable_for:'))
      .map(f => f.replace('suitable_for:', ''));

    // Find score filter (taking the first one if multiple exist)
    const scoreFilter = activeFilters.find(f => f.startsWith('Score:'));
    let scoreRange: { min: number; max: number } | null = null;

    if (scoreFilter) {
      // Parse score range from filter string (e.g., "Score: High (80-100)")
      const rangeMatch = scoreFilter.match(/\((\d+)-(\d+)\)/);
      if (rangeMatch) {
        scoreRange = {
          min: parseInt(rangeMatch[1]),
          max: parseInt(rangeMatch[2])
        };
      }
    }

    // Apply filters
    if (categoryFilters.length > 0) {
      query = query.in('category', categoryFilters);
    }

    if (suitableForFilters.length > 0) {
      query = query.in('suitable_for', suitableForFilters);
    }

    if (scoreRange) {
      query = query
        .gte('health_score', scoreRange.min)
        .lte('health_score', scoreRange.max);
    }

    // Execute the query
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Keep products that have both a valid product_name AND a valid image_url
    const filteredData = data.filter(product => {
      const hasValidName = product.product_name != null && product.product_name.trim() !== '';
      const hasValidImage = product.image_url != null && product.image_url.trim() !== '';
      return hasValidName && hasValidImage;
    });

    return filteredData as DetailedProduct[];
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    throw error;
  }
}

export async function searchProductsByName(query: string): Promise<DetailedProduct[]> {
  try {
    const { data, error } = await supabase
      .from('product_health_assessments')
      .select('*')
      .ilike('product_name', `%${query}%`)
      .limit(10)
      .order('health_score', { ascending: false });

    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Filter out products without valid names or images
    const filteredData = data.filter(product => {
      const hasValidName = product.product_name != null && product.product_name.trim() !== '';
      const hasValidImage = product.image_url != null && product.image_url.trim() !== '';
      return hasValidName && hasValidImage;
    });

    return filteredData as DetailedProduct[];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}
