
import { GoogleGenAI } from "@google/genai";
import { Part, Sale } from "../types";

export const getInventoryInsights = async (parts: Part[], sales: Sale[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Como um analista de dados especialista em gestão de estoque de autopeças, analise os seguintes dados:
    
    ESTOQUE ATUAL:
    ${JSON.stringify(parts.map(p => ({ desc: p.description, stock: p.currentStock, min: p.minStock, cost: p.costPrice })))}
    
    HISTÓRICO RECENTE DE VENDAS:
    ${JSON.stringify(sales.map(s => ({ desc: s.partDescription, qty: s.quantity, total: s.totalValue })))}
    
    Por favor, forneça um relatório em formato Markdown que contenha:
    1. Itens críticos que precisam de compra imediata.
    2. Sugestões de otimização de capital (quais peças estão paradas).
    3. Uma estimativa de lucro potencial para o próximo mês baseada na margem atual.
    4. Uma recomendação estratégica para melhorar o giro de estoque.
    
    Mantenha o tom profissional e direto ao ponto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, não foi possível gerar os insights no momento. Verifique sua conexão ou tente novamente mais tarde.";
  }
};
