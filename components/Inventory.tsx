
import React, { useState } from 'react';
import { Part, Category } from '../types';
import { Search, Plus, Filter, MoreHorizontal, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface InventoryProps {
  parts: Part[];
  onAddPart: (part: Part) => void;
  onUpdatePart: (part: Part) => void;
  onDeletePart: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ parts, onAddPart, onUpdatePart, onDeletePart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'Todos'>('Todos');

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          part.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todos' || part.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (part: Part) => {
    if (part.currentStock <= part.minStock / 2) return { label: 'Crítico', color: 'bg-red-100 text-red-700' };
    if (part.currentStock <= part.minStock) return { label: 'Repor', color: 'bg-amber-100 text-amber-700' };
    return { label: 'Saudável', color: 'bg-emerald-100 text-emerald-700' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Pesquisar por descrição ou fornecedor..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="bg-transparent text-sm font-medium focus:outline-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
            >
              <option value="Todos">Todas Categorias</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus size={18} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Descrição</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Categoria</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Preço (Custo/Venda)</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Estoque</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParts.map((part) => {
                const status = getStockStatus(part);
                const margin = ((part.salePrice - part.costPrice) / part.salePrice * 100).toFixed(1);
                
                return (
                  <tr key={part.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{part.description}</p>
                      <p className="text-xs text-slate-500">{part.supplier}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {part.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-800">R$ {part.salePrice.toFixed(2)}</span>
                        <span className="text-xs text-slate-400">Custo: R$ {part.costPrice.toFixed(2)} | {margin}% margem</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-sm font-bold text-slate-700">{part.currentStock}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Mín: {part.minStock}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${status.color}`}>
                        {status.label === 'Crítico' && <AlertCircle size={12} />}
                        {status.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDeletePart(part.id)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredParts.length === 0 && (
          <div className="py-20 text-center">
            <PackageSearch className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-500">Nenhuma peça encontrada com estes filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper internal component for empty state
const PackageSearch = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5"/>
    <path d="M12 22V12"/>
    <circle cx="18" cy="18" r="3"/>
    <path d="m21 21-1.6-1.6"/>
  </svg>
);

export default Inventory;
