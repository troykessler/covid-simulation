import { Particle } from "./Particle.class";

export enum STATUS {
  S = 'S',
  I = 'I',
  R = 'R',
  D = 'D',
  Q = 'Q'
}

export enum STATUS_COLOR {
  S = '#256dd9',
  I = '#c93030',
  R = '#689c6b',
  D = '#ffffff',
  Q = '#a232a8'
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

  quarantine: boolean;
  testsPerDay: number;

  socialDistancing: number;
  socialDistancingParticipation: number;

  centralLocations?: CentralLocation[];
  centralCapacity?: number;
  centralExchange?: number;
  centralRadius?: number;

  communities?: number;
  border?: number;
  travelsPerDay?: number;
}