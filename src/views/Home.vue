<template>
  <div>
    <div id="title">S = {{ susceptibles }}, I = {{ infected }}, R = {{ removed }}</div>
    <div id="simulation-window"></div>
    <div>
      <div id="chart" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import P5 from 'p5';
import ApexCharts from 'apexcharts'

enum STATUS {
  S = 'S',
  I = 'I',
  R = 'R'
}

enum STATUS_COLOR {
  S = '#256dd9',
  I = '#c93030',
  R = '#ffffff'
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
  recovery: number;
}

class Particle {
  x: number
  y: number

  speed: number;
  directions: number;
  d: { x: number, y: number };

  status: STATUS = STATUS.S;
  duration: number = 0;

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
      i0: 2,
      infectionRadius: 5,
      infectionRate: 0.02,
      recovery: 400
    })

    const chart = ref<any>(null)
    const counter = ref<number>(0)

    const susceptibles = ref<number>(options.value.amountParticles - options.value.i0)
    const infected = ref<number>(options.value.i0)
    const removed = ref<number>(0)

    const chartOptions = ref<any>({
      chart: {
        height: 250,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: 2
      },
      colors: ['#256dd9', '#c93030', '#ffffff'],
      series: [
        {
          name: 'Susceptibles',
          data: []
        },
        {
          name: 'Infected',
          data: []
        },
        {
          name: 'Removed',
          data: []
        }
      ]
    })

    const chartSeries: any = [
      {
        name: 'Susceptibles',
        data: [susceptibles.value]
      },
      {
        name: 'Infected',
        data: [infected.value]
      },
      {
        name: 'Removed',
        data: [removed.value]
      }
    ]
    
    const updateChart = () => {
      chartSeries[0].data = [...chartSeries[0].data, susceptibles.value]
      chartSeries[1].data = [...chartSeries[1].data, infected.value]
      chartSeries[2].data = [...chartSeries[2].data, removed.value]

      chart.value.updateSeries(chartSeries)
      counter.value++;
    }

    const sketch = (p5: any) => {
      let particles: Particle[] = [];

      function virus() {
        const radius = options.value.infectionRadius;
        const infectionRate = options.value.infectionRate;

        for (let i = 0; i < particles.length; i++) {
          particles[i].move(options.value.width, options.value.height);

          if (particles[i].status === STATUS.I && particles[i].duration > options.value.recovery) {
            particles[i].status = STATUS.R;
            infected.value--;
            removed.value++;
          }

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
                    susceptibles.value--;
                    infected.value++;
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
          particles.push(new Particle(STATUS.S, options.value));
        }

        for (let i = 0; i < options.value.i0; i++) {
          particles.push(new Particle(STATUS.I, options.value));
        }
      };

      p5.draw = () => {
        p5.background(33, 33, 33);
        virus();

        if (counter.value % 40 === 0) {
          updateChart();
        }

        counter.value++;
      };
    }

    onMounted(() => {
      new P5(sketch, 'simulation-window');

      chart.value = new ApexCharts(document.getElementById('chart'), chartOptions.value);
      chart.value.render()
    })

    return {
      susceptibles,
      infected,
      removed
    }
  }
});
</script>

<style>
#title {
  margin: 50px auto 10px auto;
  color: white;
}
#simulation-window {
  width: 500px !important;
  height: 500px !important;
  border: 2px solid white;
  margin: 0 auto;
}
#chart {
  width: 500px;
  margin: 20px auto;
}
</style>
