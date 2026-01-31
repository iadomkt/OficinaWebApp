
export type Category = 'Motor' | 'Suspensão' | 'Freios' | 'Elétrica' | 'Carroceria' | 'Acessórios' | 'Óleos e Fluidos';

export type PaymentMethod = 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'PIX' | 'Transferência';

export interface Part {
  id: string;
  description: string;
  category: Category;
  supplier: string;
  costPrice: number;
  salePrice: number;
  currentStock: number;
  minStock: number;
}

export interface Sale {
  id: string;
  partId: string;
  partDescription: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  clientName: string;
  paymentMethod: PaymentMethod;
  timestamp: string;
}

export type View = 'dashboard' | 'inventory' | 'sales' | 'ai-insights';

export interface StockStatus {
  label: 'Crítico' | 'Repor' | 'Saudável';
  color: string;
}
