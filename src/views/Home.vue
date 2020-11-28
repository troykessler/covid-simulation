<template>
  <div>
    <div class="grid grid-cols-2 m-6 text-white">
      <div>
        <div class="text-center">S = {{ susceptibles }}, I = {{ infected }}, R = {{ recovered }}, D = {{ diseased }}</div>
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
      <simulation-variables v-model="options" />
    </div>
    <div>
      <population-chart :chartSeries="chartSeries" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import SimulationVariables from '@/components/SimulationVariables.vue';
import PopulationChart from '@/components/PopulationChart.vue';
import { STATUS, STATUS_COLOR, IOptions } from '@/utils/types';
import { Particle } from '@/utils/Particle.class';
import P5 from 'p5';

export default defineComponent({
  components: {
    SimulationVariables,
    PopulationChart
  },
  setup() {
    const play = ref<boolean>(true)
    const p5sketch = ref<any>(null)

    const options = ref<IOptions>({
      width: 500,
      height: 500,
      amountParticles: 300,
      speed: 0.5,
      size: 4,
      i0: 3,
      infectionRadius: 7,
      infectionRate: 0.04,
      deathRate: 0.05,
      recoveryRate: 19 * 24,
      socialDistancing: 0
    })

    const counter = ref<number>(0);

    const susceptibles = ref<number>(options.value.amountParticles - options.value.i0);
    const infected = ref<number>(options.value.i0);
    const recovered = ref<number>(0);
    const diseased = ref<number>(0);

    const chartSeries: any = ref<any[]>([
      {
        name: 'Susceptibles',
        data: []
      },
      {
        name: 'Infected',
        data: []
      },
      {
        name: 'Recovered',
        data: []
      },
      {
        name: 'Diseased',
        data: []
      }
    ])
    
    const updateChart = () => {
      chartSeries.value[0].data = [...chartSeries.value[0].data, susceptibles.value]
      chartSeries.value[1].data = [...chartSeries.value[1].data, infected.value]
      chartSeries.value[2].data = [...chartSeries.value[2].data, recovered.value]
      chartSeries.value[3].data = [...chartSeries.value[3].data, diseased.value]
    }

    const sketch = (p5: any) => {
      let particles: Particle[] = [];

      function loop() {
        const ops: IOptions = options.value;

        for (let i = 0; i < particles.length; i++) {
          particles[i].move(ops.width, ops.height, particles, ops.socialDistancing);

          if (particles[i].status === STATUS.I && particles[i].duration > ops.recoveryRate) {
            if (Math.random() < ops.deathRate) {
              particles[i].status = STATUS.D;
              particles[i].d.x = 0;
              particles[i].d.y = 0;
              infected.value--;
              diseased.value++;
            } else {
              particles[i].status = STATUS.R;
              infected.value--;
              recovered.value++;
            }
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
                if (particleI.intersects(particleJ, ops.infectionRadius)) {
                  if (Math.random() < ops.infectionRate) {
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
        p5.createCanvas(options.value.width, options.value.height);
        particles = [];

        for (let i = 0; i < options.value.amountParticles - options.value.i0; i++) {
          particles.push(new Particle(i, STATUS.S, options.value));
        }

        for (let i = 0; i < options.value.i0; i++) {
          particles.push(new Particle(options.value.amountParticles + i, STATUS.I, options.value));
        }
      };

      p5.draw = () => {
        if (play.value) {
          p5.background(33, 33, 33);
          loop();

          if (counter.value % 24 === 0) {
            updateChart();
          }
  
          counter.value++;

          if (!infected.value) {
            play.value = false;
          }
        }
      };
    }

    const restartSimulation = () => {
      play.value = true;
      counter.value = 0;

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
          name: 'Recovered',
          data: []
        },
        {
          name: 'Diseased',
          data: []
        }
      ]

      susceptibles.value = options.value.amountParticles - options.value.i0;
      infected.value = options.value.i0;
      recovered.value = 0;
      diseased.value = 0;

      p5sketch.value.setup();
    }

    onMounted(() => {
      p5sketch.value = new P5(sketch, 'simulation-window');
    })

    return {
      susceptibles,
      infected,
      recovered,
      diseased,
      options,
      play,
      restartSimulation,
      chartSeries
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
