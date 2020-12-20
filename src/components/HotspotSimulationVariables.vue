<template>
  <div class="text-white my-12 m-auto" style="max-width: 1128px;">
    <div class="font-bold">Hotspotvariablen</div>
    <div class="mt-8 grid grid-cols-2 gap-x-24 gap-y-6">
      <div>
        <div>Hotspotgröße</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="1"
          :max="50"
          :interval="1"
          v-model="modelValue.centralParticleAmount"
        />
      </div>
      <div>
        <div>Hotspotaustauschrate</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.01"
          v-model="modelValue.centralExchangeRate"
        />
      </div>
      <div>
        <div>Hotspoteinflussradius</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="30"
          :max="250"
          :interval="5"
          v-model="modelValue.centralLocationRadius"
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