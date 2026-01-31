
import React, { useState } from 'react';
import { Sale, Part, PaymentMethod } from '../types';
import { ShoppingBag, Search, Calendar, User, CreditCard, ChevronRight } from 'lucide-react';
import { PAYMENT_METHODS } from '../constants';

interface SalesProps {
  sales: Sale[];
  parts: Part[];
  onAddSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
}

const Sales: React.FC<SalesProps> = ({ sales, parts, onAddSale }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [newSale, setNewSale] = useState({
    partId: '',
    quantity: 1,
    clientName: '',
    paymentMethod: 'PIX' as PaymentMethod
  });

  const selectedPart = parts.find(p => p.id === newSale.partId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPart || newSale.quantity > selectedPart.currentStock) return;

    onAddSale({
      partId: newSale.partId,
      partDescription: selectedPart.description,
      quantity: newSale.quantity,
      unitPrice: selectedPart.salePrice,
      totalValue: selectedPart.salePrice * newSale.quantity,
      clientName: newSale.clientName,
      paymentMethod: newSale.paymentMethod
    });
    
    setIsRegistering(false);
    setNewSale({ partId: '', quantity: 1, clientName: '', paymentMethod: 'PIX' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Histórico de Transações</h2>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm">
            <Calendar size={16} className="text-slate-400" />
            <span className="font-medium text-slate-600">Últimos 30 dias</span>
          </div>
        </div>

        <div className="space-y-3">
          {sales.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((sale) => (
            <div key={sale.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full shrink-0">
                <ShoppingBag size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{sale.partDescription}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><User size={12} /> {sale.clientName}</span>
                  <span className="flex items-center gap-1"><CreditCard size={12} /> {sale.paymentMethod}</span>
                  <span>{new Date(sale.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">R$ {sale.totalValue.toFixed(2)}</p>
                <p className="text-xs text-slate-400">{sale.quantity} unid. × R$ {sale.unitPrice.toFixed(2)}</p>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <ShoppingBag size={20} />
            Nova Venda
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Selecione a Peça</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                value={newSale.partId}
                onChange={(e) => setNewSale({...newSale, partId: e.target.value})}
                required
              >
                <option value="">Selecione...</option>
                {parts.map(p => (
                  <option key={p.id} value={p.id} disabled={p.currentStock <= 0}>
                    {p.description} ({p.currentStock} em estoque)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Quantidade</label>
                <input 
                  type="number"
                  min="1"
                  max={selectedPart?.currentStock || 1}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  value={newSale.quantity}
                  onChange={(e) => setNewSale({...newSale, quantity: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Total</label>
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-blue-400 font-bold">
                  R$ {(selectedPart ? selectedPart.salePrice * newSale.quantity : 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Cliente</label>
              <input 
                type="text"
                placeholder="Nome do cliente"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                value={newSale.clientName}
                onChange={(e) => setNewSale({...newSale, clientName: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Pagamento</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                value={newSale.paymentMethod}
                onChange={(e) => setNewSale({...newSale, paymentMethod: e.target.value as PaymentMethod})}
                required
              >
                {PAYMENT_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
              </select>
            </div>

            <button 
              type="submit"
              disabled={!selectedPart || newSale.quantity > selectedPart.currentStock}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
              Finalizar Venda
            </button>
          </form>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <h4 className="text-blue-800 font-semibold text-sm mb-2">Dica de Estoque</h4>
          <p className="text-blue-600 text-xs leading-relaxed">
            Sempre verifique o estado físico da peça antes de finalizar a venda no sistema para garantir a integridade do inventário.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sales;
