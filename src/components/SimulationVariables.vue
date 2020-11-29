<template>
  <div>
    <div class="text-center">Startbedingungen</div>
    <div class="m-auto" style="width: 500px">
      <div>Populationsgröße</div>
      <vue-slider
        class="mt-1 mr-6"
        :drag-on-click="true"
        :min="10" :max="50 * 19"
        :interval="10"
        v-model="modelValue.amountParticles"
      />
      <div class="mt-8">Infizierte</div>
      <vue-slider
        class="mt-1 mr-6"
        :drag-on-click="true"
        :min="1"
        :max="50"
        :interval="1"
        v-model="modelValue.i0"
      />
    </div>
    <div class="text-center mt-8">Dynamische Variablen</div>
    <div class="m-auto" style="width: 500px">
      <div>Infektionsdauer</div>
      <vue-slider
        class="mt-1 mr-6"
        :drag-on-click="true"
        :min="24"
        :max="24 * 50"
        :interval="1"
        :tooltip-formatter="recoveryRateFormatter"
        v-model="modelValue.recoveryRate"
      />
      <div class="mt-8">Infektionsradius</div>
      <vue-slider
        class="mt-1 mr-6"
        :drag-on-click="true"
        :min="1"
        :max="50"
        :interval="1"
        v-model="modelValue.infectionRadius"
      />
      <div class="mt-8">Infektionswahrscheinlichkeit</div>
      <vue-slider
        class="mt-1 mr-6"
        :drag-on-click="true"
        :min="0"
        :max="1"
        :interval="0.01"
        v-model="modelValue.infectionRate"
      />
      <div class="mt-8">Social Distancing</div>
      <vue-slider
        class="mt-1 mr-6"
        :drag-on-click="true"
        :min="0"
        :max="1"
        :interval="0.01"
        v-model="modelValue.socialDistancing"
      />
      <div class="mt-8">Sterberate</div>
      <vue-slider
        class="mt-1 mr-6"
        :drag-on-click="true"
        :min="0"
        :max="1"
        :interval="0.01"
        v-model="modelValue.deathRate"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueSlider from 'vue-slider-component';

export default defineComponent({
  components: {
    VueSlider
  },
  props: {
    modelValue: {
      type: Object,
      default: {}
    }
  },
  setup(props) {
    const recoveryRateFormatter = () => `${Math.floor(props.modelValue.recoveryRate / 24)}`;

    return {
      recoveryRateFormatter
    }
  }
})
</script>