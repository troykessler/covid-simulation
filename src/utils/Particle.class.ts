import { STATUS, IOptions } from '@/utils/types';

export class Particle {
  id: number;

  x: number;
  y: number;

  speed: number;
  directions: number;
  d: { x: number, y: number };

  status: STATUS = STATUS.S;
  duration: number = 0;

  contactList: number[] = [];
  contacts: number = 0;

  constructor(id: number, status: STATUS, options: IOptions) {
    this.id = id;

    this.status = status;

    this.x = Math.random() * options.width;
    this.y = Math.random() * options.height;
    this.speed = options.speed + Math.random() * 2 * options.speed
    this.directions = Math.floor(Math.random() * 360)
    
    this.d = {
      x: Math.cos(this.directions) * this.speed,
      y: Math.sin(this.directions) * this.speed
    }
  }

  move(width: number, height: number, particles: Particle[], socialDistancing: number) {
    if (this.x >= width || this.x <= 0) {
      this.d.x *= -1;
    }

    if (this.y >= height || this.y <= 0) {
      this.d.y *= -1;
    }
    
    this.x > width ? this.x = width : this.x;
    this.y > height ? this.y = height : this.y;
    this.x < 0 ? this.x = 0 : this.x;
    this.y < 0 ? this.y = 0 : this.y;

    this.x += this.d.x;
    this.y += this.d.y;

    if (this.status !== STATUS.D) {
      for (let i = 0; i < particles.length; i++) {
        const ang = Math.atan2(this.y - particles[i].y, this.x - particles[i].x);
        const dist = Math.sqrt(Math.pow(particles[i].x - this.x, 2) + Math.pow(particles[i].y - this.y, 2));
        const force = this.mapRange(socialDistancing, 0, 1, 0, 0.05) * dist;

        if (dist < 25) {
          this.x += force * Math.cos(ang);
          this.y += force * Math.sin(ang);
        }
      }
    }

    if (this.status === STATUS.I) {
      this.duration++;
    }
  }

  mapRange(value: number, low1: number, high1: number, low2: number, high2: number) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  intersects(particle: Particle, radius: number) {
    return Math.sqrt(Math.pow(particle.x - this.x, 2) + Math.pow(particle.y - this.y, 2)) < radius;
  }
}