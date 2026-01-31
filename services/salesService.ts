
import { supabase } from './supabaseClient';
import { Sale } from '../types';

export const salesService = {
    async fetchSales(): Promise<Sale[]> {
        const { data, error } = await supabase
            .from('sales')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching sales:', error);
            throw error;
        }

        return data.map(mapToSale);
    },

    async addSale(sale: Omit<Sale, 'id' | 'timestamp'>): Promise<void> {
        // Use the RPC function to ensure atomicity (deduct stock + create sale)
        const { error } = await supabase.rpc('complete_sale', {
            p_part_id: sale.partId,
            p_part_description: sale.partDescription,
            p_quantity: sale.quantity,
            p_unit_price: sale.unitPrice,
            p_total_value: sale.totalValue,
            p_client_name: sale.clientName,
            p_payment_method: sale.paymentMethod
        });

        if (error) {
            console.error('Error completing sale:', error);
            throw error;
        }
    }
};

const mapToSale = (data: any): Sale => ({
    id: data.id,
    partId: data.part_id,
    partDescription: data.part_description,
    quantity: data.quantity,
    unitPrice: data.unit_price,
    totalValue: data.total_value,
    clientName: data.client_name,
    paymentMethod: data.payment_method,
    timestamp: data.created_at
});
