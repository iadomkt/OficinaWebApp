
import { Part, Sale } from './types';

export const INITIAL_PARTS: Part[] = [
  { id: '1', description: 'Pastilha de Freio Dianteira - Bosch', category: 'Freios', supplier: 'Bosch Brasil', costPrice: 85.00, salePrice: 150.00, currentStock: 12, minStock: 5 },
  { id: '2', description: 'Amortecedor Traseiro - Cofap', category: 'Suspensão', supplier: 'Cofap Peças', costPrice: 220.00, salePrice: 380.00, currentStock: 4, minStock: 6 },
  { id: '3', description: 'Filtro de Óleo - Mann-Filter', category: 'Óleos e Fluidos', supplier: 'Mann-Filter Ltda', costPrice: 18.50, salePrice: 45.00, currentStock: 25, minStock: 10 },
  { id: '4', description: 'Correia Dentada - Gates', category: 'Motor', supplier: 'Gates Distribuidora', costPrice: 55.00, salePrice: 120.00, currentStock: 2, minStock: 8 },
  { id: '5', description: 'Bateria 60Ah - Moura', category: 'Elétrica', supplier: 'Moura Baterias', costPrice: 280.00, salePrice: 450.00, currentStock: 7, minStock: 5 },
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 's1',
    partId: '1',
    partDescription: 'Pastilha de Freio Dianteira - Bosch',
    quantity: 2,
    unitPrice: 150.00,
    totalValue: 300.00,
    clientName: 'João Silva',
    paymentMethod: 'PIX',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 's2',
    partId: '3',
    partDescription: 'Filtro de Óleo - Mann-Filter',
    quantity: 1,
    unitPrice: 45.00,
    totalValue: 45.00,
    clientName: 'Maria Oliveira',
    paymentMethod: 'Cartão de Débito',
    timestamp: new Date().toISOString(),
  }
];

export const CATEGORIES = ['Motor', 'Suspensão', 'Freios', 'Elétrica', 'Carroceria', 'Acessórios', 'Óleos e Fluidos'];
export const PAYMENT_METHODS = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Transferência'];
