
import { QueueParameters, QueueMetrics } from '../types';

/**
 * Calculates combinations C(n, k)
 */
const combinations = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = res * (n - i + 1) / i;
  }
  return res;
};

const factorial = (n: number): number => {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
};

/**
 * Calculates M/M/s/N (Finite Population)
 */
export const calculateMMsN = (params: QueueParameters): QueueMetrics => {
  const { lambda, mu, servers: s, population: N } = params;
  if (!N) throw new Error("La población (N) es requerida para este modelo.");

  // 1. Calculate P0
  let sum = 0;
  for (let n = 0; n <= N; n++) {
    if (n >= 0 && n <= s) {
      sum += combinations(N, n) * Math.pow(lambda / mu, n);
    } else {
      sum += combinations(N, n) * (factorial(n) / (factorial(s) * Math.pow(s, n - s))) * Math.pow(lambda / mu, n);
    }
  }
  const p0 = 1 / sum;

  // 2. Calculate Pn to get L
  let L = 0;
  const p = (n: number): number => {
    if (n >= 0 && n <= s) {
      return combinations(N, n) * Math.pow(lambda / mu, n) * p0;
    } else {
      return combinations(N, n) * (factorial(n) / (factorial(s) * Math.pow(s, n - s))) * Math.pow(lambda / mu, n) * p0;
    }
  };

  for (let n = 0; n <= N; n++) {
    L += n * p(n);
  }

  // 3. Calculate Lq
  let Lq = 0;
  for (let n = s + 1; n <= N; n++) {
    Lq += (n - s) * p(n);
  }

  // 4. Effective lambda and times
  // Lambda_eff = lambda * (N - L)
  const lambdaEff = lambda * (N - L);
  const W = L / lambdaEff;
  const Wq = Lq / lambdaEff;
  const rho = lambdaEff / (s * mu);

  return {
    rho,
    L,
    Lq,
    W,
    Wq,
    p0,
    lambdaEff
  };
};

export const calculateMMs = (params: QueueParameters): QueueMetrics => {
  const { lambda, mu, servers: s } = params;
  const rhoTotal = lambda / (s * mu);
  let sum = 0;
  for (let n = 0; n < s; n++) {
    sum += Math.pow(lambda / mu, n) / factorial(n);
  }
  const term2 = (Math.pow(lambda / mu, s) / (factorial(s) * (1 - rhoTotal)));
  const p0 = 1 / (sum + term2);
  const Lq = (p0 * Math.pow(lambda / mu, s) * rhoTotal) / (factorial(s) * Math.pow(1 - rhoTotal, 2));
  const L = Lq + (lambda / mu);
  const Wq = Lq / lambda;
  const W = Wq + (1 / mu);
  return { rho: rhoTotal, L, Lq, W, Wq, p0 };
};

export const calculateMM1 = (params: QueueParameters): QueueMetrics => {
  const { lambda, mu } = params;
  const rho = lambda / mu;
  const L = rho / (1 - rho);
  const Lq = Math.pow(rho, 2) / (1 - rho);
  const W = 1 / (mu - lambda);
  const Wq = lambda / (mu * (mu - lambda));
  const p0 = 1 - rho;
  return { rho, L, Lq, W, Wq, p0 };
};
