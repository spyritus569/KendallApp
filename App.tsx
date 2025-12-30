
import React, { useState } from 'react';
import { QueueForm } from './components/QueueForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { AnalysisResponse, QueueParameters } from './types';
import { calculateMM1, calculateMMs, calculateMMsN } from './services/queueLogic';
import { getAICharacterization } from './services/geminiService';

type ViewState = 'input' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('input');
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (formData: { lambda: number; mu: number; s: number; k?: number; n?: number; kendall?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const params: QueueParameters = {
        lambda: formData.lambda,
        mu: formData.mu,
        servers: formData.s,
        capacity: formData.k || formData.n,
        population: formData.n,
        kendall: formData.kendall
      };

      // 1. Validar estabilidad (Solo para poblaciones infinitas)
      if (!params.population) {
        const rho = formData.lambda / (formData.s * formData.mu);
        if (rho >= 1) {
          throw new Error("El sistema no es estable (ρ ≥ 1). No se puede analizar en estado estacionario para modelos con capacidad y población infinita.");
        }
      }

      // 2. Calcular métricas
      let metrics;
      if (params.population) {
        metrics = calculateMMsN(params);
      } else if (params.servers === 1) {
        metrics = calculateMM1(params);
      } else {
        metrics = calculateMMs(params);
      }
      
      // 3. Caracterización por IA
      const characterization = await getAICharacterization(params);

      setResult({
        parameters: params,
        metrics,
        characterization,
        isStable: true
      });
      
      // Cambiar a la pantalla de resultados tras el éxito
      setView('results');
    } catch (err: any) {
      setError(err.message || "Error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView('input');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-900 text-white py-10 shadow-lg">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="bg-indigo-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Investigación de Operaciones</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Análisis de Sistemas de Colas</h1>
            </div>
            {view === 'results' && (
              <button 
                onClick={handleBack}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-all text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Nueva Consulta
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-6 max-w-5xl py-8">
        {view === 'input' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-700">Configuración del Sistema</h2>
              <p className="text-slate-500 text-sm">Ingrese los parámetros del modelo para iniciar el análisis matemático y la caracterización inteligente.</p>
            </div>
            
            <QueueForm onAnalyze={handleAnalyze} loading={loading} />

            {error && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow-sm">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-red-800 text-sm">Error de Parámetros</h4>
                    <p className="text-red-700 mt-1 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="mt-12 flex flex-col items-center justify-center space-y-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                </div>
                <p className="text-slate-500 font-medium animate-pulse text-sm">Procesando modelos de Poisson y consultando IA...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Resultados del Análisis</h2>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                    λ: {result?.parameters.lambda}
                  </span>
                  <span className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                    μ: {result?.parameters.mu}
                  </span>
                  {result?.parameters.population && (
                    <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">
                      N: {result.parameters.population} (Población Finita)
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {result && <ResultsDisplay data={result} />}
            
            <div className="mt-12 pt-8 border-t border-slate-200 flex justify-center">
              <button 
                onClick={handleBack}
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center gap-2 group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a configurar parámetros
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Actualizado */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-10">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <p className="text-slate-700 font-bold text-base">Facultad de Ingeniería Económica - UNAP</p>
          <p className="text-slate-400 text-sm mt-1">© 2026 Educational Toolkit para Investigación de Operaciones</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-slate-400 font-mono text-[9px] uppercase tracking-widest">
            <span>λ Llegada</span>
            <span>μ Servicio</span>
            <span>N Población</span>
            <span>ρ Utilización</span>
            <span>L Magnitud</span>
            <span>W Tiempo</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
