<template>
  <div class="grid grid-cols-2 m-6 text-white">
    <div>
      <div class="text-center">S = {{ susceptibles }}, I = {{ infected }}, R = {{ removed }}</div>
      <div id="simulation-window" class="mt-4 mx-auto block"></div>
      <div class="flex justify-center items-center mt-5">
        <button class="rounded-full h-10 w-10 border-2 border-white focus:outline-none mx-2" @click="play = !play">
          <i :class="`mdi mdi-${play ? 'pause' : 'play'} text-2xl`"></i>
        </button>
        <button class="rounded-full h-10 w-10 border-2 border-white focus:outline-none mx-2" @click="restartSimulation">
          <i class="mdi mdi-replay text-2xl"></i>
        </button>
      </div>
    </div>
    <div>
      <div class="text-center">Graphischer Verlauf</div>
      <div id="chart" class="mt-6 mx-auto block" />
      <div class="text-center">Startbedingungen</div>
      <div class="m-auto" style="width: 500px">
        <div>Populationsgröße</div>
        <vue-slider class="mt-1 mr-6" :drag-on-click="true" :min="10" :max="1000" :interval="1" v-model="options.amountParticles"></vue-slider>
      </div>
      <div class="text-center mt-8">Dynamische Variablen</div>
      <div class="m-auto" style="width: 500px">
        <div>Größe</div>
        <vue-slider class="mt-1 mr-6" :drag-on-click="true" :min="1" :max="15" :interval="1" v-model="options.size"></vue-slider>
        <div class="mt-8">Infektionsradius</div>
        <vue-slider class="mt-1 mr-6" :drag-on-click="true" :min="1" :max="50" :interval="1" v-model="options.infectionRadius"></vue-slider>
        <div class="mt-8">Infektionswahrscheinlichkeit</div>
        <vue-slider class="mt-1 mr-6" :drag-on-click="true" :min="0" :max="0.2" :interval="0.005" v-model="options.infectionRate"></vue-slider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import P5 from 'p5';
import ApexCharts from 'apexcharts';
import VueSlider from 'vue-slider-component';

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
  components: {
    VueSlider
  },
  setup() {
    const play = ref<boolean>(true)
    const p5sketch = ref<any>(null)

    const options = ref<IOptions>({
      width: 500,
      height: 500,
      amountParticles: 500,
      speed: 0.5,
      size: 4,
      i0: 2,
      infectionRadius: 7,
      infectionRate: 0.025,
      recovery: 350
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
      grid: {
        borderColor: '#a9b3b8',
        strokeDashArray: 1
      },
      stroke: {
        curve: 'straight',
        width: 2
      },
      colors: ['#256dd9', '#c93030', '#ffffff'],
      xaxis: {
        labels: {
          show: false
        }
      },
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
    
    const updateChart = () => {
      chartSeries[0].data = [...chartSeries[0].data, susceptibles.value]
      chartSeries[1].data = [...chartSeries[1].data, infected.value]
      chartSeries[2].data = [...chartSeries[2].data, removed.value]
    }

    const sketch = (p5: any) => {
      let particles: Particle[] = [];

      function loop() {
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
        particles = []

        for (let i = 0; i < options.value.amountParticles - options.value.i0; i++) {
          particles.push(new Particle(STATUS.S, options.value));
        }

        for (let i = 0; i < options.value.i0; i++) {
          particles.push(new Particle(STATUS.I, options.value));
        }
      };

      p5.draw = () => {
        if (play.value) {
          p5.background(33, 33, 33);
          loop();
  
          if (counter.value % 10) {
            // updateChart()
          }
  
          if (counter.value % 10 === 0) {
            chart.value.updateSeries(chartSeries)
          }
  
          counter.value++;
        }
      };
    }

    const restartSimulation = () => {
      play.value = true;
      counter.value = 0;
      chartOptions.value = {
        ...chartOptions.value,
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
      }

      chartSeries.value = [
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

      susceptibles.value = options.value.amountParticles - options.value.i0
      infected.value = options.value.i0
      removed.value = 0

      p5sketch.value.setup()
    }

    onMounted(() => {
      p5sketch.value = new P5(sketch, 'simulation-window');

      chart.value = new ApexCharts(document.getElementById('chart'), chartOptions.value);
      chart.value.render()
    })

    return {
      susceptibles,
      infected,
      removed,
      options,
      play,
      restartSimulation
    }
  }
});
</script>

<style>
#simulation-window {
  width: 500px;
  height: 500px;
  outline: 2px solid white;
}
#chart {
  width: 500px;
}
</style>
