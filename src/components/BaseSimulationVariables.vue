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
        <div>Initial Infiziert</div>
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
    <div class="mt-12 font-bold">Variablen Krankheit</div>
    <div class="mt-8 grid grid-cols-2 gap-x-24 gap-y-6">
      <div>
        <div>Infektionswahrscheinlichkeit pro Kontakt</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.001"
          :tooltip-formatter="() => `${(modelValue.infectionRate * 100).toFixed(1)}%`"
          v-model="modelValue.infectionRate"
        />
      </div>
      <div>
        <div>Infektionsdauer</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="24"
          :max="24 * 50"
          :interval="1"
          :tooltip-formatter="() => `${Math.floor(modelValue.recoveryRate / 24)} Tage`"
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
          :tooltip-formatter="() => `${(modelValue.infectionRadius / 10).toFixed(1)}m`"
          v-model="modelValue.infectionRadius"
        />
      </div>
      <div>
        <div>Sterberate</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.001"
          :tooltip-formatter="() => `${(modelValue.deathRate * 100).toFixed(1)}%`"
          v-model="modelValue.deathRate"
        />
      </div>
    </div>
    <div class="mt-12 font-bold">Variablen Maskenpflicht</div>
    <div class="mt-8 grid grid-cols-2 gap-x-24 gap-y-6">
      <div>
        <div>Anteil Maskenträger von Population</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.01"
          :tooltip-formatter="() => `${(modelValue.maskParticipation * 100).toFixed(0)}%`"
          v-model="modelValue.maskParticipation"
        />
      </div>
      <div>
        <div>Infektionswahrscheinlichkeit pro Kontakt mit Maske</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.001"
          :tooltip-formatter="() => `${(modelValue.maskInfectionRate * 100).toFixed(1)}%`"
          v-model="modelValue.maskInfectionRate"
        />
      </div>
    </div>
    <div class="mt-12 font-bold">Variablen physische Distanzierung</div>
    <div class="mt-8 grid grid-cols-2 gap-x-24 gap-y-6">
      <div>
        <div>Anteilnahme physische Distanzierung von Population</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.01"
          :tooltip-formatter="() => `${(modelValue.socialDistancingParticipation * 100).toFixed(0)}%`"
          v-model="modelValue.socialDistancingParticipation"
        />
      </div>
      <div>
        <div>Physischer Distanzierungsfaktor (0 bis 1)</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="1"
          :interval="0.01"
          v-model="modelValue.socialDistancing"
        />
      </div>
    </div>
    <div class="mt-12 font-bold">Variablen Quarantäne</div>
    <div class="mt-8 grid grid-cols-2 gap-x-24 gap-y-6">
      <div>
        <div>Quarantäne</div>
        <input class="mt-2" type="checkbox" v-model="modelValue.quarantine" />
      </div>
      <div>
        <div>Tests pro Tag</div>
        <vue-slider
          class="mt-1"
          :drag-on-click="true"
          :min="0"
          :max="50"
          :interval="1"
          :disabled="!modelValue.quarantine"
          v-model="modelValue.testsPerDay"
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
