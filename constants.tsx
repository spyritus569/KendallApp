
import React from 'react';

export const SYMBOLS = {
  lambda: 'λ',
  mu: 'μ',
  rho: 'ρ',
  L: 'L',
  Lq: 'Lq',
  W: 'W',
  Wq: 'Wq',
  s: 's',
  K: 'K',
  N: 'N'
};

export const TOOLTIPS = {
  lambda: "Tasa media de llegadas por unidad de tiempo por cada cliente potencial.",
  mu: "Tasa media de servicio por servidor por unidad de tiempo.",
  rho: "Factor de utilización del sistema.",
  L: "Número promedio de clientes en el sistema (esperando + en servicio).",
  Lq: "Número promedio de clientes en la cola.",
  W: "Tiempo promedio de estancia en el sistema.",
  Wq: "Tiempo promedio de espera en la cola.",
  kendall: "Notación A/B/s/K/N. Ejemplo: M/M/7//100 indica 7 servidores y una población total de 100.",
  population: "Tamaño total de la población de clientes potenciales (N)."
};
