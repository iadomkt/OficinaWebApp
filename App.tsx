
import React, { useState, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import AIInsights from './components/AIInsights';
import { View, Part, Sale } from './types';
import { INITIAL_PARTS, INITIAL_SALES } from './constants';
import { Bell, Search, User } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);

  // Inventory Handlers
  const handleAddPart = useCallback((newPart: Part) => {
    setParts(prev => [...prev, newPart]);
  }, []);

  const handleUpdatePart = useCallback((updatedPart: Part) => {
    setParts(prev => prev.map(p => p.id === updatedPart.id ? updatedPart : p));
  }, []);

  const handleDeletePart = useCallback((id: string) => {
    if (confirm('Deseja realmente excluir esta peça?')) {
      setParts(prev => prev.filter(p => p.id !== id));
    }
  }, []);

  // Sales Handlers
  const handleAddSale = useCallback((newSaleData: Omit<Sale, 'id' | 'timestamp'>) => {
    const newSale: Sale = {
      ...newSaleData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };

    // Lowers the stock
    setParts(prev => prev.map(p => 
      p.id === newSaleData.partId 
        ? { ...p, currentStock: p.currentStock - newSaleData.quantity }
        : p
    ));

    setSales(prev => [...prev, newSale]);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard parts={parts} sales={sales} />;
      case 'inventory':
        return (
          <Inventory 
            parts={parts} 
            onAddPart={handleAddPart}
            onUpdatePart={handleUpdatePart}
            onDeletePart={handleDeletePart}
          />
        );
      case 'sales':
        return <Sales sales={sales} parts={parts} onAddSale={handleAddSale} />;
      case 'ai-insights':
        return <AIInsights parts={parts} sales={sales} />;
      default:
        return <Dashboard parts={parts} sales={sales} />;
    }
  };

  const criticalItemsCount = useMemo(() => 
    parts.filter(p => p.currentStock <= p.minStock).length, 
  [parts]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 capitalize">
              {currentView === 'ai-insights' ? 'Insights com IA' : currentView}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Busca global..." 
                className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
            
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              {criticalItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {criticalItemsCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-none">Admin Oficina</p>
                <p className="text-xs text-slate-500 mt-1">Gestor Master</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
