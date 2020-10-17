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
  x: number = 0;
  y: number = 0;

  speed: number = 0;
  directions: number = 0;

  d: { x: number, y: number } = { x: 0, y: 0 };

  status: STATUS = STATUS.S;

  constructor(status: STATUS, options: IOptions) {
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
}

export default defineComponent({
  setup() {
    const options = ref<IOptions>({
      width: 500,
      height: 500,

      amountParticles: 200,
      speed: 1,
      size: 5,

      i0: 3,
      infectionRadius: 10
    })

    const particles = ref<Particle[]>([])

    const updateParticle = (particle: Particle) => {
      if (particle.x >= options.value.width || particle.x <= 0) {
        particle.d.x *= -1;
      }
      if (particle.y >= options.value.height || particle.y <= 0) {
        particle.d.y *= -1;
      }
      particle.x > options.value.width ? particle.x = options.value.width : particle.x;
      particle.y > options.value.height ? particle.y = options.value.height : particle.y;
      particle.x < 0 ? particle.x = 0 : particle.x;
      particle.y < 0 ? particle.y = 0 : particle.y;

      particle.x += particle.d.x;
      particle.y += particle.d.y;
    }

    const calcDistance = (p1: Particle, p2: Particle) => {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    }

    const calcConnections = (p1: Particle) => {
      if (p1.status === STATUS.I) {
        for (let i = 0; i < options.value.amountParticles; i++) {
          if (particles.value[i].status === STATUS.S) {
            const distance = calcDistance(p1, particles.value[i])
    
            if (distance && distance <= options.value.infectionRadius) {
              particles.value[i].status = STATUS.I
            }
          }
        }
      }
    }

    const sketch = (p5: any) => {
      p5.setup = () => {
        p5.createCanvas(options.value.width, options.value.height);

        for (let i = 0; i < options.value.amountParticles - options.value.i0; i++) {
          particles.value.push(new Particle(STATUS.S, options.value))
        }

        for (let i = 0; i < options.value.i0; i++) {
          particles.value.push(new Particle(STATUS.I, options.value))
        }
      };

      p5.draw = () => {
        p5.background(33, 33, 33);

        for (let i = 0; i < options.value.amountParticles; i++) {
          updateParticle(particles.value[i])

          p5.fill(STATUS_COLOR[particles.value[i].status])
          p5.ellipse(particles.value[i].x, particles.value[i].y, options.value.size, options.value.size)
        }

        for (let i = 0; i < options.value.amountParticles; i++) {
          calcConnections(particles.value[i])
        }
      };
    }

    onMounted(() => {
      new P5(sketch, 'simulation-window');
    })

    return {
      options
    }
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
