
import React, { useMemo } from 'react';
import { Part, Sale } from '../types';
import {
  TrendingUp,
  AlertTriangle,
  DollarSign,
  PackageCheck,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DashboardProps {
  parts: Part[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps & { onNavigate: (view: any) => void }> = ({ parts, sales, onNavigate }) => {
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalValue, 0);
    const totalCost = sales.reduce((acc, s) => {
      const part = parts.find(p => p.id === s.partId);
      return acc + (part ? part.costPrice * s.quantity : 0);
    }, 0);
    const totalProfit = totalRevenue - totalCost;
    const criticalStock = parts.filter(p => p.currentStock <= p.minStock).length;

    return {
      totalRevenue,
      totalProfit,
      criticalStock,
      totalInventoryValue: parts.reduce((acc, p) => acc + (p.costPrice * p.currentStock), 0)
    };
  }, [parts, sales]);

  const salesByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    sales.forEach(sale => {
      const part = parts.find(p => p.id === sale.partId);
      if (part) {
        categories[part.category] = (categories[part.category] || 0) + sale.totalValue;
      }
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [parts, sales]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Faturamento Total"
          value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={<DollarSign className="text-blue-600" />}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Lucro Líquido"
          value={`R$ ${stats.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={<TrendingUp className="text-emerald-600" />}
          trend="+8.5%"
          trendUp={true}
        />
        <StatCard
          title="Valor em Estoque"
          value={`R$ ${stats.totalInventoryValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={<PackageCheck className="text-indigo-600" />}
          trend="-2.1%"
          trendUp={false}
        />
        <StatCard
          title="Itens Críticos"
          value={stats.criticalStock.toString()}
          icon={<AlertTriangle className="text-amber-600" />}
          trend={stats.criticalStock > 3 ? "Atenção" : "Normal"}
          trendUp={false}
          highlight={stats.criticalStock > 3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Vendas por Categoria</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `R$ ${value}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('sales')}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors group"
            >
              <span className="font-medium">Nova Venda</span>
              <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
            </button>
            <button
              onClick={() => onNavigate('inventory')}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors group"
            >
              <span className="font-medium">Repor Estoque</span>
              <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
            </button>
            <button
              onClick={() => onNavigate('inventory')}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 transition-colors group"
            >
              <span className="font-medium">Cadastrar Peça</span>
              <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
            </button>
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Alertas Recentes</h4>
            <div className="space-y-4">
              {parts.filter(p => p.currentStock <= p.minStock).slice(0, 3).map(p => (
                <div key={p.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{p.description}</p>
                    <p className="text-xs text-slate-500">Estoque atual: {p.currentStock} (Mín: {p.minStock})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, highlight }) => (
  <div className={`bg-white p-6 rounded-xl border shadow-sm transition-all ${highlight ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 rounded-lg bg-slate-50">{icon}</div>
      <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : highlight ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
        }`}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default Dashboard;
