<template>
  <div>
    <div class="grid grid-cols-2 gap-x-32 my-6">
      <div class="text-white text-right">
        <div class="inline-block">
          <div class="text-center">
            S = {{ susceptibles }}, I = {{ infected }}, R = {{ recovered }}, D =
            {{ diseased }} | R0 = {{ basicReproduction || 0 }}
          </div>
          <div id="simulation-window" class="mt-4 mx-auto block"></div>
          <div class="flex justify-center items-center mt-5">
            <button
              class="rounded-full h-10 w-10 border-2 border-white focus:outline-none mx-2 hover:bg-white hover:bg-opacity-10"
              @click="play = !play"
            >
              <i :class="`mdi mdi-${play ? 'pause' : 'play'} text-2xl`"></i>
            </button>
            <button
              class="rounded-full h-10 w-10 border-2 border-white focus:outline-none mx-2 hover:bg-white hover:bg-opacity-10"
              @click="restartSimulation"
            >
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
          <basic-reproduction-number-chart
            class="chart"
            :chartSeries="brnSeries"
          />
        </div>
      </div>
    </div>
    <div class="text-center">
      <button
        class="mr-2 btn-outline-blue focus:outline-none border border-blue-700 hover:bg-blue-700 text-blue-700 hover:text-white font-normal py-2 px-4 rounded"
        @click="$router.replace('/')"
      >
        Basismodell
      </button>
      <button
        class="my-2 btn-outline-blue focus:outline-none border border-blue-700 hover:bg-blue-700 text-blue-700 hover:text-white font-normal py-2 px-4 rounded"
        @click="$router.replace('/central')"
      >
        Hotspots
      </button>
      <button
        class="ml-2 ml-2btn-outline-blue focus:outline-none border border-blue-700 hover:bg-blue-700 text-blue-700 hover:text-white font-normal py-2 px-4 rounded"
        @click="$router.replace('/communities')"
      >
        Communities
      </button>
    </div>
    <div class="mb-32">
      <base-simulation-variables v-model="options" />
      <central-simulation-variables v-model="options" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import BaseSimulationVariables from "@/components/BaseSimulationVariables.vue";
import CentralSimulationVariables from "@/components/CentralSimulationVariables.vue";
import PopulationChart from "@/components/PopulationChart.vue";
import BasicReproductionNumberChart from "@/components/BasicReproductionNumberChart.vue";
import { STATUS, STATUS_COLOR, IOptions } from "@/utils/types";
import { Particle } from "@/utils/Particle.class";
import P5 from "p5";

export default defineComponent({
  components: {
    BaseSimulationVariables,
    CentralSimulationVariables,
    PopulationChart,
    BasicReproductionNumberChart,
  },
  setup() {
    const play = ref<boolean>(true);
    const p5sketch = ref<any>(null);

    const options = ref<IOptions>({
      width: 500,
      height: 500,
      amountParticles: 300,
      speed: 0.5,
      size: 4,
      i0: 3,
      infectionRadius: 3,
      infectionRate: 0.25,
      deathRate: 0.05,
      recoveryRate: 19 * 24,
      socialDistancing: 0,
      centralParticleAmount: 10,
      centralExchangeRate: 0.1,
      centralLocationRadius: 100,
    });

    const counter = ref<number>(0);
    const basicReproduction = ref<number | null>(0);
    const effectiveReproduction = ref<number | null>(0);
    const brnSeries = ref<any[]>([
      {
        name: "Basisreproduktionszahl",
        data: [],
      },
      {
        name: "Nettoreproduktionszahl",
        data: [],
      },
    ]);

    const susceptibles = ref<number>(
      options.value.amountParticles - options.value.i0
    );
    const infected = ref<number>(options.value.i0);
    const recovered = ref<number>(0);
    const diseased = ref<number>(0);

    const chartSeries = ref<any[]>([
      {
        name: "Susceptibles",
        data: [],
      },
      {
        name: "Infected",
        data: [],
      },
      {
        name: "Recovered",
        data: [],
      },
      {
        name: "Diseased",
        data: [],
      },
    ]);

    const centralLocations = ref<any[]>([
      {
        center: {
          x: 125,
          y: 125,
        },
        particles: [],
      },
      {
        center: {
          x: 375,
          y: 125,
        },
        particles: [],
      },
      {
        center: {
          x: 250,
          y: 250,
        },
        particles: [],
      },
      {
        center: {
          x: 125,
          y: 375,
        },
        particles: [],
      },
      {
        center: {
          x: 375,
          y: 375,
        },
        particles: [],
      },
    ]);

    const updateChart = () => {
      chartSeries.value[0].data = [
        ...chartSeries.value[0].data,
        susceptibles.value,
      ];
      chartSeries.value[1].data = [
        ...chartSeries.value[1].data,
        infected.value,
      ];
      chartSeries.value[2].data = [
        ...chartSeries.value[2].data,
        recovered.value,
      ];
      chartSeries.value[3].data = [
        ...chartSeries.value[3].data,
        diseased.value,
      ];

      brnSeries.value[0].data = [
        ...brnSeries.value[0].data,
        basicReproduction.value,
      ];
      brnSeries.value[1].data = [
        ...brnSeries.value[1].data,
        effectiveReproduction.value,
      ];
    };

    const sketch = (p5: any) => {
      let particles: Particle[] = [];

      function loop() {
        const ops: IOptions = options.value;

        centralLocations.value.forEach((location) => {
          if (
            location.particles.length < options.value.centralParticleAmount!
          ) {
            const particlesInRadius = particles.filter(
              (particle) =>
                particle.distance(location.center.x, location.center.y) <
                options.value.centralLocationRadius!
            );

            if (particlesInRadius.length) {
              const particleIndex = Math.floor(
                Math.random() * particlesInRadius.length
              );
              location.particles.unshift(particlesInRadius[particleIndex]);
              particlesInRadius[particleIndex].travelTo(
                location.center.x,
                location.center.y,
                0
              );
            }
          } else if (Math.random() < options.value.centralExchangeRate!) {
            if (
              !location.particles[options.value.centralParticleAmount! - 1]
                .travelling
            ) {
              const particle = location.particles.pop();
              const ang = 2 * Math.PI * Math.random() - Math.PI;
              const x =
                location.center.x +
                Math.cos(ang) *
                  options.value.centralLocationRadius! *
                  Math.random();
              const y =
                location.center.y +
                Math.sin(ang) *
                  options.value.centralLocationRadius! *
                  Math.random();
              particle?.travelTo(x, y, options.value.speed);
            }
          }
        });

        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];

          particles[i].move(ops, particles);

          if (
            particle.status === STATUS.I &&
            particle.duration > ops.recoveryRate
          ) {
            if (Math.random() < ops.deathRate) {
              particle.status = STATUS.D;
              particle.d.x = 0;
              particle.d.y = 0;
              infected.value--;
              diseased.value++;
            } else {
              particle.status = STATUS.R;
              infected.value--;
              recovered.value++;
            }
          }

          p5.fill(STATUS_COLOR[particles[i].status]);
          p5.stroke(0, 0, 0);
          p5.ellipse(
            particles[i].x,
            particles[i].y,
            options.value.size,
            options.value.size
          );
        }

        for (let i = 0; i < particles.length; i++) {
          for (let j = 0; j < particles.length; j++) {
            if (i !== j) {
              let particleI: Particle = particles[i];
              let particleJ: Particle = particles[j];

              if (particleI.status === STATUS.I) {
                if (
                  particleI.distance(particleJ.x, particleJ.y) <
                  ops.infectionRadius
                ) {
                  particleI.contactList = {
                    ...particleI.contactList,
                    [particleJ.id]: particleJ,
                  };
                } else if (particleI.contactList[particleJ.id]) {
                  if (particleI.contactList[particleJ.id].status === STATUS.S) {
                    if (Math.random() < ops.infectionRate) {
                      particleJ.status = STATUS.I;
                      infected.value++;
                      susceptibles.value--;
                    }
                    particleI.effectiveContacts++;
                  }
                  delete particleI.contactList[particleJ.id];
                  particleI.basicContacts++;
                }
              }
            }
          }
        }
      }

      p5.setup = () => {
        p5.createCanvas(options.value.width, options.value.height);
        particles = [];

        centralLocations.value.forEach((location) => (location.particles = []));

        for (
          let i = 0;
          i < options.value.amountParticles - options.value.i0;
          i++
        ) {
          particles.push(new Particle(i, STATUS.S, options.value));
        }

        for (let i = 0; i < options.value.i0; i++) {
          particles.push(
            new Particle(
              options.value.amountParticles + i,
              STATUS.I,
              options.value
            )
          );
        }
      };

      p5.draw = () => {
        if (play.value) {
          p5.background(33, 33, 33);

          centralLocations.value.forEach((location) => {
            p5.fill("rgba(0,0,0,0)");
            p5.stroke("white");
            p5.circle(location.center.x, location.center.y, 30, 30);
          });

          loop();

          if (counter.value % 24 === 0) {
            if (infected.value) {
              const effectiveContacts =
                particles
                  .filter((p) => p.status === STATUS.I)
                  .reduce(
                    (sum: number, p: Particle) =>
                      sum +
                      p.effectiveContacts *
                        (options.value.recoveryRate / p.duration),
                    0
                  ) / infected.value;

              const basicContacts =
                particles
                  .filter((p) => p.status === STATUS.I)
                  .reduce(
                    (sum: number, p: Particle) =>
                      sum +
                      p.basicContacts *
                        (options.value.recoveryRate / p.duration),
                    0
                  ) / infected.value;

              effectiveReproduction.value = parseFloat(
                (effectiveContacts * options.value.infectionRate).toFixed(2)
              );
              basicReproduction.value = parseFloat(
                (basicContacts * options.value.infectionRate).toFixed(2)
              );
            } else {
              effectiveReproduction.value = null;
              basicReproduction.value = null;
            }

            updateChart();
          }

          counter.value++;

          if (!infected.value) {
            updateChart();
            play.value = false;
          }
        }
      };
    };

    const restartSimulation = () => {
      play.value = true;
      counter.value = 0;

      chartSeries.value = [
        {
          name: "Susceptibles",
          data: [],
        },
        {
          name: "Infected",
          data: [],
        },
        {
          name: "Recovered",
          data: [],
        },
        {
          name: "Diseased",
          data: [],
        },
      ];

      brnSeries.value = [
        {
          name: "Basisreproduktionszahl",
          data: [],
        },
        {
          name: "Nettoreproduktionszahl",
          data: [],
        },
      ];

      susceptibles.value = options.value.amountParticles - options.value.i0;
      infected.value = options.value.i0;
      recovered.value = 0;
      diseased.value = 0;

      p5sketch.value.setup();
    };

    onMounted(() => {
      p5sketch.value = new P5(sketch, "simulation-window");
    });

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
      brnSeries,
    };
  },
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
