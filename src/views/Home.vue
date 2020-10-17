<template>
  <div>
    <div id="canvas"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import P5 from 'p5'

export default defineComponent({
  setup() {
    const width = ref<number>(500)
    const height = ref<number>(500)

    onMounted(() => {
      const sketch = (s: any) => {
        s.setup = () => {
          s.createCanvas(width.value, height.value);
        };

        s.draw = () => {
          s.background(33, 33, 33);
          s.ellipse(50, 50, 100, 100);
        };
      }

      let canvas = new P5(sketch, 'canvas');
    })
  }
});
</script>

<style>
#canvas {
  width: 500px !important;
  height: 500px !important;
  border: 2px solid white;
  margin: 100px auto;
}
</style>
