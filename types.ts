
export interface QueueParameters {
  lambda: number;    // Arrival rate per potential customer
  mu: number;        // Service rate per server
  servers: number;   // 's'
  capacity?: number; // 'K' (System capacity)
  population?: number; // 'N' (Total population size)
  kendall?: string;  // Raw Kendall string
}

export interface QueueMetrics {
  rho: number;       // Utilization factor
  L: number;         // Average number in system
  Lq: number;        // Average number in queue
  W: number;         // Average time in system
  Wq: number;        // Average time in queue
  p0: number;        // Probability of zero customers
  lambdaEff?: number; // Effective arrival rate (crucial for finite population)
}

export interface SystemCharacterization {
  type: string;
  assumptions: string[];
  applications: string[];
  discipline: string;
  explanation: string;
}

export interface AnalysisResponse {
  parameters: QueueParameters;
  metrics: QueueMetrics;
  characterization: SystemCharacterization;
  isStable: boolean;
  error?: string;
}
