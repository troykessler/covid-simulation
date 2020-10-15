<template>
  <div>
    <canvas id="simulation-window"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  setup() {
    onMounted(() => {
      const canvasBody: any = document.getElementById("simulation-window");
      const canvas = canvasBody.getContext("2d");

      let w = (canvasBody.width = window.innerWidth);
      let h = (canvasBody.height = window.innerHeight);

      let tick = 0;

      const opts = {
        backgroundColor: "#222",
        particleColor: "#fcfcfc",
        particleAmount: 40,
        defaultSpeed: 1,
        addedSpeed: 2,

        defaultRadius: 2,
        addedRadius: 2,

        communicationRadius: 150,
      };

      const particles = [];

      window.addEventListener("resize", () => {
        w = canvasBody.width = window.innerWidth;
        h = canvasBody.height = window.innerHeight;
      });

      function loop() {
        window.requestAnimationFrame(loop);
        tick++;

        canvas.fillStyle = opts.backgroundColor;
        canvas.fillRect(0, 0, w, h);
      }

      function setup() {
        window.requestAnimationFrame(loop);
      }

      setup();
    });

    return {};
  },
});
</script>
