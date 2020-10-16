<template>
  <div>
    <canvas id="simulation-window"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  setup() {
    const canvas = ref<any>(null);

    const width = ref<number | null>(null);
    const height = ref<number | null>(null);

    const tick = ref<number>(0);

    const options = ref<any>({
      backgroundColor: "#222",
      particleColor: "#fcfcfc",
      particleAmount: 40,
      defaultSpeed: 1,
      addedSpeed: 2,

      defaultRadius: 2,
      addedRadius: 2,

      communicationRadius: 150,
    });

    const loop = () => {
      window.requestAnimationFrame(loop);
      tick.value++;

      canvas.value.fillStyle = options.value.backgroundColor;
      canvas.value.fillRect(0, 0, width.value, height.value);
    };

    const setup = () => {
      window.requestAnimationFrame(loop);
    };

    onMounted(() => {
      const canvasBody: any = document.getElementById("simulation-window");
      canvas.value = canvasBody.getContext("2d");

      width.value = canvasBody.width = window.innerWidth;
      height.value = canvasBody.height = window.innerHeight;

      window.addEventListener("resize", () => {
        width.value = canvasBody.width = window.innerWidth;
        height.value = canvasBody.height = window.innerHeight;
      });

      setup();
    });

    return {};
  },
});
</script>
