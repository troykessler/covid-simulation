export enum STATUS {
  S = 'S',
  I = 'I',
  R = 'R',
  D = 'D'
}

export enum STATUS_COLOR {
  S = '#256dd9',
  I = '#c93030',
  R = '#689c6b',
  D = '#ffffff'
}

export interface IOptions {
  width: number;
  height: number;
  amountParticles: number;
  speed: number;
  size: number;
  i0: number;
  infectionRadius: number;
  infectionRate: number;
  deathRate: number;
  recoveryRate: number;
  socialDistancing: number;

  centralParticleAmount?: number;
  centralExchangeRate?: number;
  centralLocationRadius?: number;
}