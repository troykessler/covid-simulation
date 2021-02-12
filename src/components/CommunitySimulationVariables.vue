<template>
  <div class="text-white my-12 m-auto" style="max-width: 1128px;">
    <div class="font-bold">Variablen Grenzen & Reisen</div>
    <div class="mt-8 grid grid-cols-2 gap-x-24 gap-y-6">
      <div>
        <div>Anzahl an Kommunen</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="1"
          :max="5"
          :interval="1"
          :tooltip-formatter="communityFormatter"
          v-model="modelValue.communities"
        />
      </div>
      <div>
        <div>Grenzdichte</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.01"
          v-model="modelValue.border"
        />
      </div>
      <div>
        <div>Reisen pro Tag</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="20"
          :interval="1"
          v-model="modelValue.travelsPerDay"
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
    const communityFormatter = () => `${Math.pow(props.modelValue.communities, 2)}`;

    return {
      communityFormatter
    }
  }
})
</script>
