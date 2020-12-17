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
          <population-chart class="chart" :chartSeries="dataSeries" />
          <div class="text-white q-mt-lg">Reproduktionszahlen</div>
          <basic-reproduction-number-chart
            class="chart"
            :chartSeries="reproductionSeries"
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
      <community-simulation-variables v-model="options" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import BaseSimulationVariables from "@/components/BaseSimulationVariables.vue";
import CommunitySimulationVariables from "@/components/CommunitySimulationVariables.vue";
import PopulationChart from "@/components/PopulationChart.vue";
import BasicReproductionNumberChart from "@/components/BasicReproductionNumberChart.vue";
import { IOptions } from "@/utils/types";
import { useSimulation } from "@/hooks/useSimulation";

export default defineComponent({
  components: {
    BaseSimulationVariables,
    PopulationChart,
    BasicReproductionNumberChart,
    CommunitySimulationVariables
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
      infectionRadius: 7,
      infectionRate: 0.25,
      deathRate: 0.05,
      recoveryRate: 19 * 24,
      socialDistancing: 0,

      communities: 3,
      border: 0.98,
      travelsPerDay: 2
    });

    return {
      options,
      ...useSimulation(options.value)
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
