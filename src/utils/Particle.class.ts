import { STATUS, IOptions } from '@/utils/types';

export class Particle {
  id: number;

  x: number;
  y: number;

  speed: number;
  directions: number;
  d: { x: number, y: number };

  status: STATUS = STATUS.S;
  duration: number = 1;

  contactList: any = {};

  effectiveContacts: number = 0;
  basicContacts: number = 0;

  travelling: boolean = false;
  travelCounter: number = 60;

  constructor(id: number, status: STATUS, options: IOptions) {
    this.id = id;

    this.status = status;

    this.x = Math.random() * options.width;
    this.y = Math.random() * options.height;
    this.speed = options.speed + Math.random() * 2 * options.speed
    this.directions = (2 * Math.PI * Math.random()) - Math.PI;
    
    this.d = {
      x: Math.cos(this.directions) * this.speed,
      y: Math.sin(this.directions) * this.speed
    }
  }

  move(width: number, height: number, particles: Particle[], socialDistancing: number) {
    if (this.travelCounter > 0) {

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
    } else {
      this.travelling = false;
    }

    if (this.status === STATUS.I) {
      this.duration++;
    }

    if (this.travelling) {
      this.travelCounter--;
    }
  
  }

  mapRange(value: number, low1: number, high1: number, low2: number, high2: number) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  distance(x: number, y: number): number {
    return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2))
  }

  travelTo(x: number, y: number): void {
    const directions = Math.atan2(y - this.y, x - this.x);
    const speed = this.distance(x, y) / 60;

    this.d = {
      x: Math.cos(directions) * speed,
      y: Math.sin(directions) * speed,
    }

    this.travelCounter = (x - this.x) / this.d.x;
    this.travelling = true;
  }
}