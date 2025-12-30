
import { GoogleGenAI, Type } from "@google/genai";
import { QueueParameters, SystemCharacterization } from "../types";

export const getAICharacterization = async (params: QueueParameters): Promise<SystemCharacterization> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const isFinite = !!params.population;
  
  const prompt = `Actúa como un experto en Investigación de Operaciones y Teoría de Colas. 
  Analiza un sistema de colas con los siguientes parámetros:
  - Tasa de llegadas (lambda): ${params.lambda} (por cliente potencial)
  - Tasa de servicio (mu): ${params.mu} (por servidor)
  - Número de servidores (s): ${params.servers}
  - Tamaño de población (N): ${params.population || 'Infinita'}
  - Capacidad del sistema (K): ${params.capacity || 'Infinita'}
  - Notación de Kendall: ${params.kendall || (isFinite ? `M/M/${params.servers}//${params.population}` : `M/M/${params.servers}`)}

  Este es un modelo de ${isFinite ? 'POBLACIÓN FINITA' : 'POBLACIÓN INFINITA'}.
  
  Proporciona una respuesta en JSON con los campos:
  - type: Nombre formal del sistema (ej: M/M/7/N/N o M/M/1).
  - assumptions: Lista de 3 supuestos matemáticos (ej: Proceso de nacimiento-muerte).
  - applications: Lista de 2 ejemplos reales para este caso específico de población ${isFinite ? 'finita' : 'infinita'}.
  - discipline: Disciplina (ej: FIFO).
  - explanation: Un párrafo académico explicando cómo afecta el tamaño de la población y el número de servidores al rendimiento.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
          applications: { type: Type.ARRAY, items: { type: Type.STRING } },
          discipline: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["type", "assumptions", "applications", "discipline", "explanation"]
      }
    }
  });

  return JSON.parse(response.text);
};
