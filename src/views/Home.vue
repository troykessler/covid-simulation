<template>
  <div>
    <div id="simulation-window"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import P5 from 'p5';

enum STATUS {
  S = 'S',
  I = 'I',
  R = 'R'
}

enum STATUS_COLOR {
  S = '#256dd9',
  I = '#c93030',
  R = 'white'
}

interface IOptions {
  width: number;
  height: number;
  amountParticles: number;
  speed: number;
  size: number;
  i0: number;
  infectionRadius: number;
}

class Particle {
  x: number
  y: number

  speed: number;
  directions: number;
  d: { x: number, y: number };

  status: STATUS = STATUS.S;
  width: number;
  height: number;

  constructor(status: STATUS, width: number, height: number, speed: number) {
    this.status = status;
    this.width = width;
    this.height = height;

    this.x = Math.random() * this.width;
    this.y = Math.random() * this.height;
    this.speed = speed + Math.random() * 2 * speed
    this.directions = Math.floor(Math.random() * 360)
    
    this.d = {
      x: Math.cos(this.directions) * this.speed,
      y: Math.sin(this.directions) * this.speed
    }
  }

  move() {
    if (this.x >= this.width || this.x <= 0) {
      this.d.x *= -1;
    }
    if (this.y >= this.height || this.y <= 0) {
      this.d.y *= -1;
    }
    this.x > this.width ? this.x = this.width : this.x;
    this.y > this.height ? this.y = this.height : this.y;
    this.x < 0 ? this.x = 0 : this.x;
    this.y < 0 ? this.y = 0 : this.y;
    this.x += this.d.x;
    this.y += this.d.y;
  }

  intersects(particle: Particle, radius: number) {
    return Math.sqrt(Math.pow(particle.x - this.x, 2) + Math.pow(particle.y - this.y, 2)) < radius;
  }
}

export default defineComponent({
  setup() {
    const options = ref<IOptions>({
      width: 500,
      height: 500,
      amountParticles: 1000,
      speed: 0.5,
      size: 4,
      i0: 3,
      infectionRadius: 10
    })

    const sketch = (p5: any) => {
      let particles: Particle[] = [];

      function virus() {
        const radius = options.value.infectionRadius;

        for (let i = 0; i < particles.length; i++) {
          particles[i].move();
          p5.fill(STATUS_COLOR[particles[i].status]);
          p5.ellipse(particles[i].x, particles[i].y, options.value.size, options.value.size);
        }
        for (let i = 0; i < particles.length; i++) {
          for (let j = 0; j < particles.length; j++) {
            if (j != i && particles[i].intersects(particles[j], radius) && particles[j].status === STATUS.I) {
              particles[i].status = STATUS.I;
            }
          }
        }
      }

      p5.setup = () => {
        p5.createCanvas(500, 500);

        for (let i = 0; i < options.value.amountParticles - options.value.i0; i++) {
          particles.push(new Particle(STATUS.S, options.value.width, options.value.height, options.value.speed));
        }

        for (let i = 0; i < options.value.i0; i++) {
          particles.push(new Particle(STATUS.I, options.value.width, options.value.height, options.value.speed));
        }
      };

      p5.draw = () => {
        p5.background(33, 33, 33);
        virus();
      };
    }

    onMounted(() => {
      new P5(sketch, 'simulation-window');
    })

    return {}
  }
});
</script>

<style>
#simulation-window {
  width: 500px !important;
  height: 500px !important;
  border: 2px solid white;
  margin: 100px auto;
}
</style>
