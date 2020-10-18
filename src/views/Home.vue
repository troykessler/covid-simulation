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

  constructor(status: STATUS) {
    this.x = Math.random() * 500;
    this.y = Math.random() * 500;
    this.speed = 1 + Math.random() * 2 * 1
    this.directions = Math.floor(Math.random() * 360)
    
    this.d = {
      x: Math.cos(this.directions) * this.speed,
      y: Math.sin(this.directions) * this.speed
    }

    this.status = status;
  }
  move() {
    if (this.x >= 500 || this.x <= 0) {
      this.d.x *= -1;
    }
    if (this.y >= 500 || this.y <= 0) {
      this.d.y *= -1;
    }
    this.x > 500 ? this.x = 500 : this.x;
    this.y > 500 ? this.y = 500 : this.y;
    this.x < 0 ? this.x = 0 : this.x;
    this.y < 0 ? this.y = 0 : this.y;
    this.x += this.d.x;
    this.y += this.d.y;
  }
  infected() {
    //set if loop then make bool false for reset
    this.status = STATUS.I;
  }
  intersects(other: any) {
    var d = Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
    return d < 5;
  }
  cured() {
    this.status = STATUS.R;
  }
}

export default defineComponent({
  setup() {
    const options = ref<IOptions>({
      width: 500,
      height: 500,
      amountParticles: 200,
      speed: 1,
      size: 4,
      i0: 3,
      infectionRadius: 10
    })

    const sketch = (p5: any) => {

      let person: any;
      //array
      let people: Particle[] = [];

      let create: any = true;

      let corona: any;

      function virus() {
        people[0].infected();
        for (let i = 0; i < people.length; i++) {
          people[i].move();
          p5.fill(STATUS_COLOR[people[i].status]);
          p5.ellipse(people[i].x, people[i].y, options.value.size, options.value.size);
        }
        for (let i = 0; i < people.length; i++) {
          for (let j = 0; j < people.length; j++) {
            if (j != i && people[i].intersects(people[j]) && people[j].status === STATUS.I) {
              people[i].infected();
            }
          }
        }
      }

      p5.setup = () => {
        p5.createCanvas(500, 500);

        for (let i = 0; i < 1000; i++) {
          people.push(new Particle(STATUS.S));
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
