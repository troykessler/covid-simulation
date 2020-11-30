<template>
  <div>
    <div class="grid grid-cols-2 gap-x-32 my-6">
      <div class="text-white text-right">
        <div class="inline-block">
          <div class="text-center">S = {{ susceptibles }}, I = {{ infected }}, R = {{ recovered }}, D = {{ diseased }} | R0 = {{ basicReproduction }}</div>
          <div id="simulation-window" class="mt-4 mx-auto block"></div>
          <div class="flex justify-center items-center mt-5">
            <button class="rounded-full h-10 w-10 border-2 border-white focus:outline-none mx-2 hover:bg-white hover:bg-opacity-10" @click="play = !play">
              <i :class="`mdi mdi-${play ? 'pause' : 'play'} text-2xl`"></i>
            </button>
            <button class="rounded-full h-10 w-10 border-2 border-white focus:outline-none mx-2 hover:bg-white hover:bg-opacity-10" @click="restartSimulation">
              <i class="mdi mdi-replay text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div class="inline-block text-center">
          <div class="text-white">Demographie Population</div>
          <population-chart class="chart" :chartSeries="chartSeries" />
          <div class="text-white q-mt-lg">Reproduktionszahlen</div>
          <basic-reproduction-number-chart class="chart" :chartSeries="brnSeries" />
        </div>
      </div>
    </div>
    <div class="mb-32">
      <simulation-variables v-model="options" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import SimulationVariables from '@/components/SimulationVariables.vue';
import PopulationChart from '@/components/PopulationChart.vue';
import BasicReproductionNumberChart from '@/components/BasicReproductionNumberChart.vue';
import { STATUS, STATUS_COLOR, IOptions } from '@/utils/types';
import { Particle } from '@/utils/Particle.class';
import P5 from 'p5';

export default defineComponent({
  components: {
    SimulationVariables,
    PopulationChart,
    BasicReproductionNumberChart,
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
      infectionRate: 0.25,
      deathRate: 0.05,
      recoveryRate: 19 * 24,
      socialDistancing: 0
    })

    const counter = ref<number>(0);
    const basicReproduction = ref<number | null>(null);
    const effectiveReproduction = ref<number | null>(null);
    const brnSeries = ref<any[]>([
      {
        name: 'Basisreproduktionszahl',
        data: []
      },
      {
        name: 'Nettoreproduktionszahl',
        data: []
      }
    ])

    const susceptibles = ref<number>(options.value.amountParticles - options.value.i0);
    const infected = ref<number>(options.value.i0);
    const recovered = ref<number>(0);
    const diseased = ref<number>(0);

    const chartSeries = ref<any[]>([
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
      chartSeries.value[0].data = [...chartSeries.value[0].data, susceptibles.value];
      chartSeries.value[1].data = [...chartSeries.value[1].data, infected.value];
      chartSeries.value[2].data = [...chartSeries.value[2].data, recovered.value];
      chartSeries.value[3].data = [...chartSeries.value[3].data, diseased.value];

      brnSeries.value[0].data = [...brnSeries.value[0].data, basicReproduction.value];
      brnSeries.value[1].data = [...brnSeries.value[1].data, effectiveReproduction.value];
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
                  particleI.effectiveContactList.push(particleJ.id);
                } else {
                  if (particleI.effectiveContactList.find(id => id === particleJ.id)) {
                    if (Math.random() < ops.infectionRate) {
                      particleJ.status = STATUS.I;
                      infected.value++;
                      susceptibles.value--;
                    }
                    particleI.effectiveContactList = particleI.effectiveContactList.filter(id => id !== particleJ.id);
                    particleI.effectiveContacts++;
                  }
                }
              }

              if (particleI.status === STATUS.I) {
                if (particleI.intersects(particleJ, ops.infectionRadius)) {
                  particleI.basicContactList.push(particleJ.id);
                } else {
                  if (particleI.basicContactList.find(id => id === particleJ.id)) {
                    particleI.basicContactList = particleI.basicContactList.filter(id => id !== particleJ.id);
                    particleI.basicContacts++;
                  }
                }
              }
            }
          }
        }

        if (infected.value) {
          const effectiveContacts = particles
            .filter(p => p.status === STATUS.I)
            .reduce(
              (sum: number, p: Particle) => sum + (p.effectiveContacts * (ops.recoveryRate / p.duration)
            ), 0) / infected.value;

          const basicContacts = particles
            .filter(p => p.status === STATUS.I)
            .reduce(
              (sum: number, p: Particle) => sum + (p.basicContacts * (ops.recoveryRate / p.duration)
            ), 0) / infected.value;
  
          effectiveReproduction.value = parseFloat((effectiveContacts * ops.infectionRate).toFixed(2)) || null;
          basicReproduction.value = parseFloat((basicContacts * ops.infectionRate).toFixed(2)) || null;
        } else {
          effectiveReproduction.value = null;
          basicReproduction.value = null;
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
            updateChart();
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

      brnSeries.value = [
        {
          name: 'Basisreproduktionszahl',
          data: []
        },
        {
          name: 'Nettoreproduktionszahl',
          data: []
        },
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
      chartSeries,
      basicReproduction,
      brnSeries
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
.chart {
  width: 500px;
}
</style>
