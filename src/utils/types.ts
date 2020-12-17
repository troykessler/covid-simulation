import { Particle } from "./Particle.class";

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

interface CentralLocation {
  center: { x: number, y: number };
  particles: Particle[];
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

  centralLocations?: CentralLocation[];
  centralParticleAmount?: number;
  centralExchangeRate?: number;
  centralLocationRadius?: number;

  communities?: number;
  border?: number;
  travelsPerDay?: number;
}