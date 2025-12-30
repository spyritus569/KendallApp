
import React from 'react';
import { AnalysisResponse } from '../types';
import { SYMBOLS, TOOLTIPS } from '../constants';
import { InfoTooltip } from './InfoTooltip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  data: AnalysisResponse;
}

export const ResultsDisplay: React.FC<Props> = ({ data }) => {
  const { metrics, characterization, isStable } = data;

  const chartData = [
    { name: 'En Sistema (L)', value: metrics.L, fill: '#6366f1' },
    { name: 'En Cola (Lq)', value: metrics.Lq, fill: '#818cf8' },
    { name: 'T. Sistema (W)', value: metrics.W, fill: '#0ea5e9' },
    { name: 'T. Cola (Wq)', value: metrics.Wq, fill: '#38bdf8' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Metrics Grid */}
      <section>
        <h3 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">Resultados del Modelo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard symbol={SYMBOLS.rho} label="Utilización" value={metrics.rho} tooltip={TOOLTIPS.rho} percentage />
          <MetricCard symbol={SYMBOLS.L} label="Media en Sistema" value={metrics.L} tooltip={TOOLTIPS.L} />
          <MetricCard symbol={SYMBOLS.Lq} label="Media en Cola" value={metrics.Lq} tooltip={TOOLTIPS.Lq} />
          <MetricCard symbol={SYMBOLS.W} label="Tiempo en Sistema" value={metrics.W} tooltip={TOOLTIPS.W} />
          <MetricCard symbol={SYMBOLS.Wq} label="Tiempo en Cola" value={metrics.Wq} tooltip={TOOLTIPS.Wq} />
          <MetricCard symbol="P0" label="Prob. Vacío" value={metrics.p0} tooltip="Probabilidad de que no haya clientes en el sistema." percentage />
        </div>
      </section>

      {/* Visualizations */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-slate-700">Visualización de Magnitudes</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Characterization */}
      <section className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 text-indigo-900">Caracterización del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <span className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">Tipo de Sistema</span>
              <p className="text-2xl font-mono font-bold text-indigo-900">{characterization.type}</p>
            </div>
            <div className="mb-4">
              <span className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">Disciplina</span>
              <p className="text-slate-800">{characterization.discipline}</p>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed italic border-l-4 border-indigo-300 pl-4">
              {characterization.explanation}
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">Supuestos Principales</span>
              <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                {characterization.assumptions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
            <div>
              <span className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">Aplicaciones Reales</span>
              <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                {characterization.applications.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const MetricCard: React.FC<{ symbol: string, label: string, value: number, tooltip: string, percentage?: boolean }> = ({ symbol, label, value, tooltip, percentage }) => (
  <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-bold text-slate-400 flex items-center">
        {label} <InfoTooltip text={tooltip} />
      </span>
      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-mono text-slate-600">{symbol}</span>
    </div>
    <div className="text-2xl font-semibold text-slate-800">
      {percentage ? `${(value * 100).toFixed(2)}%` : value.toFixed(4)}
    </div>
  </div>
);
