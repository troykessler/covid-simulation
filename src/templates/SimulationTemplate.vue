<template>
  <div>
    <div class="text-white  my-12 m-auto" style="max-width: 1128px;">
      <div class="flex justify-between items-center">
        <span class="font-bold text-4xl">Covid-19 Simulation</span>
        <button
          class="flex items-center justify-center rounded w-32 border-2 border-white focus:outline-none mx-2 hover:bg-white hover:bg-opacity-10"
          @click="openGitHub"
        >
          <i class="mdi mdi-github text-2xl"></i>
          <span class="text-base font-bold ml-2">GitHub</span>
        </button>
      </div>
      <div class="mt-6 text-sm flex items-center">
        <i class="mdi mdi-information-outline text-xl mr-2"></i>
        Es handelt sich hier um ein
        visuelles Simulationsprogramm, mit dem man die Ausbreitungsdynamik von Covid-19 und anderen Krankheiten spielerisch
        erforschen kann.
      </div>
      <div class="mt-2 text-sm flex items-center">
        <i class="mdi mdi-source-pull text-xl mr-2"></i>
        Da es sich um ein OpenSource Projekt handelt sind Pull-Requests und andere Verbesserungsvorschläge erwünscht!
      </div>
    </div>
    <div class="grid grid-cols-2 gap-x-32 my-6">
      <div class="text-white text-right">
        <div class="inline-block">
          <div class="text-center">
            S = {{ susceptibles }}, I = {{ infected }}, R = {{ recovered }}, D =
            {{ diseased }} | R0 = {{ basicReproduction || 0 }}
          </div>
          <div :id="`simulation-window-${name}`" class="simulation-window mt-4 mx-auto block"></div>
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
          <reproduction-chart
            class="chart"
            :chartSeries="reproductionSeries"
          />
        </div>
      </div>
    </div>
    <div class="text-white my-12 m-auto" style="max-width: 1128px;">
      <div class="font-bold">Zusätzliche Faktoren</div>
      <div class="flex items-center mt-4">
        <input id="radio-base" value="/" v-model="model" type="radio" class="h-4 w-4" @input="switchModel">
        <label for="radio-base" class="ml-3 block">
          Keine
        </label>
      </div>
      <div class="flex items-center">
        <input id="radio-hotspot" value="hotspots" v-model="model" type="radio" class="h-4 w-4" @input="switchModel">
        <label for="radio-hotspot" class="ml-3 block">
          Zentrale Einrichtungen
        </label>
      </div>
      <div class="flex items-center">
        <input id="radio-community" value="communities" v-model="model" type="radio" class="h-4 w-4" @input="switchModel">
        <label for="radio-community" class="ml-3 block">
          Grenzen & Reisen
        </label>
      </div>
    </div>
    <div class="mb-32">
      <slot name="variables" />
    </div>
    <div v-if="simulationExperimentMode">
      <population-experiment-chart :chartSeries="experimentDataSeries"></population-experiment-chart>
      <reproduction-experiment-chart :chartSeries="experimentReproductionSeries"></reproduction-experiment-chart>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import PopulationChart from "@/components/PopulationChart.vue";
import ReproductionChart from "@/components/ReproductionChart.vue";
import PopulationExperimentChart from "@/components/PopulationExperimentChart.vue";
import ReproductionExperimentChart from "@/components/ReproductionExperimentChart.vue";
import MasksChart from "@/charts/MasksChart.vue";
import { IOptions } from "@/utils/types";
import { useSimulation } from '@/hooks/useSimulation';
import router from '@/router';

export default defineComponent({
  components: {
    PopulationChart,
    ReproductionChart,
    PopulationExperimentChart,
    ReproductionExperimentChart,
    MasksChart
  },
  props: {
    name: {
      type: String,
      required: true
    },
    options: {
      required: true
    }
  },
  setup(props) {
    const model = ref<any>(props.name)

    const switchModel = (event: any) => {
      router.replace(event.target.value)
    }

    const openGitHub = () => {
      window.open('https://github.com/troykessler/covid-simulation', '_blank')
    }

    return {
      model,
      switchModel,
      openGitHub,
      ...useSimulation(`simulation-window-${props.name}`, props.options as IOptions)
    };
  },
});
</script>

<style>
.simulation-window {
  width: 500px;
  height: 500px;
  outline: 2px solid white;
}
.chart {
  width: 500px;
}
</style>
