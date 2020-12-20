<template>
  <div>
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
          <basic-reproduction-number-chart
            class="chart"
            :chartSeries="reproductionSeries"
          />
        </div>
      </div>
    </div>
    <div class="text-white my-12 m-auto" style="max-width: 1128px;">
      <div class="font-bold">Modell</div>
      <div class="flex items-center mt-4">
        <input id="radio-base" value="/" v-model="model" type="radio" class="h-4 w-4" @input="switchModel">
        <label for="radio-base" class="ml-3 block">
          Basismodell
        </label>
      </div>
      <div class="flex items-center">
        <input id="radio-hotspot" value="hotspots" v-model="model" type="radio" class="h-4 w-4" @input="switchModel">
        <label for="radio-hotspot" class="ml-3 block">
          Hotspotmodell
        </label>
      </div>
      <div class="flex items-center">
        <input id="radio-community" value="communities" v-model="model" type="radio" class="h-4 w-4" @input="switchModel">
        <label for="radio-community" class="ml-3 block">
          Communitymodell
        </label>
      </div>
    </div>
    <div class="mb-32">
      <slot name="variables" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import PopulationChart from "@/components/PopulationChart.vue";
import BasicReproductionNumberChart from "@/components/BasicReproductionNumberChart.vue";
import { IOptions } from "@/utils/types";
import { useSimulation } from '@/hooks/useSimulation';
import router from '@/router';

export default defineComponent({
  components: {
    PopulationChart,
    BasicReproductionNumberChart,
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

    return {
      model,
      switchModel,
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
