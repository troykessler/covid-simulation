<template>
  <simulation-template name="communities" :options="options">
    <template #variables>
      <base-simulation-variables v-model="options" />
      <community-simulation-variables v-model="options" />
    </template>
  </simulation-template>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SimulationTemplate from "@/templates/SimulationTemplate.vue";
import BaseSimulationVariables from "@/components/BaseSimulationVariables.vue";
import CommunitySimulationVariables from "@/components/CommunitySimulationVariables.vue";
import router from '@/router';
import { IOptions } from "@/utils/types";

export default defineComponent({
  components: {
    SimulationTemplate,
    BaseSimulationVariables,
    CommunitySimulationVariables
  },
  setup() {
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
      quarantine: false,
      testsPerDay: 10,
      socialDistancing: 0,
      socialDistancingParticipation: 1,

      communities: 3,
      border: 0.98,
      travelsPerDay: 2
    });

    return {
      options
    };
  },
});
</script>
