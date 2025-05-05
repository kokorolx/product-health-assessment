import { DetailedProduct } from '@/types';
import { supabase } from './supabaseClient';

export async function getInitialProducts(): Promise<DetailedProduct[]> {
  try {
    const { data, error } = await supabase
      .from('product_health_assessments')
      .select('*')
      .limit(20)
      .order('created_at', { ascending: false });

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

export async function getFilteredProducts(activeFilters: string[]): Promise<DetailedProduct[]> {
  try {
    // If no filters are active, return initial products
    if (activeFilters.length === 0) {
      return getInitialProducts();
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
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data as DetailedProduct[];
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    throw error;
  }
}
