
import React, { useState } from 'react';
import { SYMBOLS, TOOLTIPS } from '../constants';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  onAnalyze: (data: { lambda: number; mu: number; s: number; k?: number; n?: number; kendall?: string }) => void;
  loading: boolean;
}

export const QueueForm: React.FC<Props> = ({ onAnalyze, loading }) => {
  const [mode, setMode] = useState<'parameters' | 'kendall'>('parameters');
  const [lambda, setLambda] = useState('0.25');
  const [mu, setMu] = useState('4.0');
  const [servers, setServers] = useState('7');
  const [capacity, setCapacity] = useState('');
  const [population, setPopulation] = useState('100');
  const [kendall, setKendall] = useState('M/M/7//100');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'parameters') {
      onAnalyze({
        lambda: parseFloat(lambda),
        mu: parseFloat(mu),
        s: parseInt(servers),
        k: capacity ? parseInt(capacity) : undefined,
        n: population ? parseInt(population) : undefined
      });
    } else {
      // Parsing simple de notación A/B/s/K/N
      const parts = kendall.split('/');
      const s = parseInt(parts[2]) || 1;
      const k = parts[3] ? parseInt(parts[3]) : undefined;
      const n = parts[4] ? parseInt(parts[4]) : undefined;
      
      onAnalyze({
        lambda: parseFloat(lambda),
        mu: parseFloat(mu),
        s,
        k,
        n,
        kendall
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="flex border-b border-slate-100">
        <button
          type="button"
          onClick={() => setMode('parameters')}
          className={`flex-1 py-4 text-sm font-medium transition-colors ${mode === 'parameters' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Ingresar Parámetros Manualmente
        </button>
        <button
          type="button"
          onClick={() => setMode('kendall')}
          className={`flex-1 py-4 text-sm font-medium transition-colors ${mode === 'kendall' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Usar Notación de Kendall
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center">
              Tasa de llegadas por cliente ({SYMBOLS.lambda}) <InfoTooltip text={TOOLTIPS.lambda} />
            </label>
            <input
              type="number"
              step="0.0001"
              required
              value={lambda}
              onChange={(e) => setLambda(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Ej: 0.25"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center">
              Tasa de servicio por servidor ({SYMBOLS.mu}) <InfoTooltip text={TOOLTIPS.mu} />
            </label>
            <input
              type="number"
              step="0.0001"
              required
              value={mu}
              onChange={(e) => setMu(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Ej: 4.0"
            />
          </div>
        </div>

        {mode === 'parameters' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                Servidores ({SYMBOLS.s})
              </label>
              <input
                type="number"
                min="1"
                required
                value={servers}
                onChange={(e) => setServers(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                Población Total ({SYMBOLS.N}) <InfoTooltip text={TOOLTIPS.population} />
              </label>
              <input
                type="number"
                min="1"
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Ej: 100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                Capacidad ({SYMBOLS.K})
              </label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Vacío = N"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center">
              Notación de Kendall <InfoTooltip text={TOOLTIPS.kendall} />
            </label>
            <input
              type="text"
              required
              value={kendall}
              onChange={(e) => setKendall(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
              placeholder="M/M/7//100"
            />
            <p className="text-[10px] text-slate-400 italic">Estructura: Llegadas / Servicio / s / K / N</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-indigo-300 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Procesando...' : 'Analizar Sistema'}
        </button>
      </form>
    </div>
  );
};
