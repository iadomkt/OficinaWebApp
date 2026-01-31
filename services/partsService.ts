
import { supabase } from './supabaseClient';
import { Part } from '../types';

export const partsService = {
    async fetchParts(): Promise<Part[]> {
        const { data, error } = await supabase
            .from('parts')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching parts:', error);
            throw error;
        }

        return data.map(mapToPart);
    },

    async addPart(part: Omit<Part, 'id'>): Promise<Part> {
        const { data, error } = await supabase
            .from('parts')
            .insert([{
                description: part.description,
                category: part.category,
                supplier: part.supplier,
                cost_price: part.costPrice,
                sale_price: part.salePrice,
                current_stock: part.currentStock,
                min_stock: part.minStock
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding part:', error);
            throw error;
        }

        return mapToPart(data);
    },

    async updatePart(part: Part): Promise<Part> {
        const { data, error } = await supabase
            .from('parts')
            .update({
                description: part.description,
                category: part.category,
                supplier: part.supplier,
                cost_price: part.costPrice,
                sale_price: part.salePrice,
                current_stock: part.currentStock,
                min_stock: part.minStock
            })
            .eq('id', part.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating part:', error);
            throw error;
        }

        return mapToPart(data);
    },

    async addStock(partId: string, quantity: number, costPrice: number, supplier: string): Promise<void> {
        const { error } = await supabase.rpc('add_stock', {
            p_part_id: partId,
            p_quantity: quantity,
            p_cost_price: costPrice,
            p_supplier: supplier
        });

        if (error) {
            console.error('Error adding stock:', error);
            throw error;
        }
    },

    async deletePart(id: string): Promise<void> {
        const { error } = await supabase
            .from('parts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting part:', error);
            throw error;
        }
    }
};

const mapToPart = (data: any): Part => ({
    id: data.id,
    description: data.description,
    category: data.category,
    supplier: data.supplier,
    costPrice: data.cost_price,
    salePrice: data.sale_price,
    currentStock: data.current_stock,
    minStock: data.min_stock
});
