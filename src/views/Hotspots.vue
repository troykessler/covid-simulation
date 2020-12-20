<template>
  <simulation-template name="hotspots" :options="options">
    <template #variables>
      <base-simulation-variables v-model="options" />
      <hotspot-simulation-variables v-model="options" />
    </template>
  </simulation-template>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SimulationTemplate from "@/templates/SimulationTemplate.vue";
import BaseSimulationVariables from "@/components/BaseSimulationVariables.vue";
import HotspotSimulationVariables from "@/components/HotspotSimulationVariables.vue";
import router from '@/router';
import { IOptions } from "@/utils/types";

export default defineComponent({
  components: {
    SimulationTemplate,
    BaseSimulationVariables,
    HotspotSimulationVariables
  },
  setup() {
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
      socialDistancingParticipation: 1,

      centralLocations: [
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
      ],
      centralParticleAmount: 10,
      centralExchangeRate: 0.1,
      centralLocationRadius: 100,
    });

    return {
      options
    };
  },
});
</script>
