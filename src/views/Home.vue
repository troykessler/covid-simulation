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
  infectionRate: number;
}

class Particle {
  x: number
  y: number

  speed: number;
  directions: number;
  d: { x: number, y: number };

  status: STATUS = STATUS.S;
  duration: number = 0;

  constructor(status: STATUS, width: number, height: number, speed: number) {
    this.status = status;

    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.speed = speed + Math.random() * 2 * speed
    this.directions = Math.floor(Math.random() * 360)
    
    this.d = {
      x: Math.cos(this.directions) * this.speed,
      y: Math.sin(this.directions) * this.speed
    }
  }

  move(width: number, height: number) {
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

    if (this.status === STATUS.I) {
      this.duration++;

      if (this.duration > 500) {
        this.status = STATUS.R;
      }
    }
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
      infectionRadius: 5,
      infectionRate: 0.015
    })

    const sketch = (p5: any) => {
      let particles: Particle[] = [];

      function virus() {
        const radius = options.value.infectionRadius;
        const infectionRate = options.value.infectionRate;

        for (let i = 0; i < particles.length; i++) {
          particles[i].move(options.value.width, options.value.height);
          p5.fill(STATUS_COLOR[particles[i].status]);
          p5.ellipse(particles[i].x, particles[i].y, options.value.size, options.value.size);
        }
        for (let i = 0; i < particles.length; i++) {
          for (let j = 0; j < particles.length; j++) {
            if (i !== j) {
              let particleI: Particle = particles[i];
              let particleJ: Particle = particles[j];

              if (particleI.status === STATUS.I && particleJ.status === STATUS.S) {
                if (particleI.intersects(particleJ, radius)) {
                  if (Math.random() < infectionRate) {
                    particleJ.status = STATUS.I;
                  }
                }
              }
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
