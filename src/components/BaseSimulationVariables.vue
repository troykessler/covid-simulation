<template>
  <div class="text-white my-12 m-auto" style="max-width: 1128px;">
    <div class="font-bold">Startbedingungen</div>
    <div class="mt-8 grid grid-cols-2 gap-x-24 gap-y-6">
      <div>
        <div>Populationsgröße</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="10" :max="50 * 19"
          :interval="10"
          v-model="modelValue.amountParticles"
        />
      </div>
      <div>
        <div>Infizierte</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="1"
          :max="50"
          :interval="1"
          v-model="modelValue.i0"
        />
      </div>
    </div>
    <div class="mt-12 font-bold">Dynamische Variablen</div>
    <div class="mt-8 grid grid-cols-2 gap-x-24 gap-y-6">
      <div>
        <div>Infektionsdauer</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="24"
          :max="24 * 50"
          :interval="1"
          :tooltip-formatter="recoveryRateFormatter"
          v-model="modelValue.recoveryRate"
        />
      </div>
      <div>
        <div>Infektionsradius</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="1"
          :max="50"
          :interval="1"
          v-model="modelValue.infectionRadius"
        />
      </div>
      <div>
        <div>Infektionswahrscheinlichkeit</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.01"
          v-model="modelValue.infectionRate"
        />
      </div>
      <div>
        <div>Social Distancing</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.01"
          v-model="modelValue.socialDistancing"
        />
      </div>
      <div>
        <div>Sterberate</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.01"
          v-model="modelValue.deathRate"
        />
      </div>
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