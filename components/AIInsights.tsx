
import React, { useState } from 'react';
import { Sparkles, BrainCircuit, RefreshCw } from 'lucide-react';
import { Part, Sale } from '../types';
import { getInventoryInsights } from '../services/geminiService';

interface AIInsightsProps {
  parts: Part[];
  sales: Sale[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ parts, sales }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    const result = await getInventoryInsights(parts, sales);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <BrainCircuit size={28} />
            </div>
            <h2 className="text-2xl font-bold">Inteligência de Inventário</h2>
          </div>
          <p className="text-indigo-100 text-lg mb-8 max-w-xl">
            Nossa IA analisa seu estoque, histórico de vendas e margens de lucro para sugerir ações inteligentes que otimizam seu fluxo de caixa.
          </p>
          <button 
            onClick={generateReport}
            disabled={loading}
            className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? 'Analisando dados...' : 'Gerar Insights Estratégicos'}
          </button>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full -ml-24 -mb-24 blur-3xl" />
      </div>

      {insight ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="prose prose-slate max-w-none">
            {/* Simple Markdown Parser/Display */}
            {insight.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-slate-800 mt-6 mb-4">{line.replace('# ', '')}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-slate-700 mt-5 mb-3">{line.replace('## ', '')}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-slate-600 mt-4 mb-2">{line.replace('### ', '')}</h3>;
              if (line.startsWith('1. ') || line.startsWith('2. ')) return <p key={i} className="text-slate-600 ml-4 mb-2">{line}</p>;
              if (line.trim() === '') return <div key={i} className="h-4" />;
              return <p key={i} className="text-slate-600 mb-2 leading-relaxed">{line}</p>;
            })}
          </div>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <Sparkles className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">Clique no botão acima para iniciar a análise dos seus dados.</p>
          </div>
        )
      )}

      {loading && (
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
