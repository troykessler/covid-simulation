<template>
  <simulation-template name="/" :options="options">
    <template #variables>
      <base-simulation-variables v-model="options" />
    </template>
  </simulation-template>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SimulationTemplate from "@/templates/SimulationTemplate.vue";
import BaseSimulationVariables from "@/components/BaseSimulationVariables.vue";
import router from '@/router';
import { IOptions } from "@/utils/types";

export default defineComponent({
  components: {
    SimulationTemplate,
    BaseSimulationVariables
  },
  setup() {
    const options = ref<IOptions>({
      width: 500,
      height: 500,
      amountParticles: 300,
      speed: 0.5,
      size: 4,
      i0: 3,
      infectionRadius: 10,
      infectionRate: 0.22,
      deathRate: 0.036,
      recoveryRate: 19 * 24,
      quarantine: true,
      testsPerDay: 0,
      maskInfectionRate: 0.1,
      maskParticipation: 0,
      socialDistancing: 1,
      socialDistancingParticipation: 0
    });

    return {
      options
    };
  },
});
</script>
