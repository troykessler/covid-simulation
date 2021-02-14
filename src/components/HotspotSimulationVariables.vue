<template>
  <div class="text-white my-12 m-auto" style="max-width: 1128px;">
    <div class="font-bold">Variablen zentrale Einrichtungen</div>
    <div class="mt-8 grid grid-cols-2 gap-x-24 gap-y-6">
      <div>
        <div>Kapazität von Einrichtungen</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="1"
          :max="50"
          :interval="1"
          :tooltip-formatter="() => `${modelValue.centralCapacity} Individuen`"
          v-model="modelValue.centralCapacity"
        />
      </div>
      <div>
        <div>Besucherrate von Einrichtungen (0 bis 1)</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.01"
          v-model="modelValue.centralExchange"
        />
      </div>
      <div>
        <div>Einflussradius von Einrichtungen</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="30"
          :max="250"
          :interval="5"
          :tooltip-formatter="() => `${(modelValue.centralRadius / 10).toFixed(1)}m`"
          v-model="modelValue.centralRadius"
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
  }
})
</script>