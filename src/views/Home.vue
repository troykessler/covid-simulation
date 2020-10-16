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
    const particles = ref<any[]>([])

    const options = ref<any>({
      backgroundColor: "#222",
      particleColor: "#fcfcfc",
      particleAmount: 100,
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

      for(let i = 0; i < particles.value.length; i++){
        particles.value[i].update();
        particles.value[i].draw();
      }

      for (let a = 0; a < particles.value.length; a++) {
        drawConnections(particles.value[a], particles.value)
      }
    };

    const setup = () => {
      for(let i = 0; i < options.value.particleAmount; i++){
        particles.value.push(new Particle());
      }
      window.requestAnimationFrame(loop);
    };

    const Particle = class {
      x: number = Math.random() * width.value!;
      y: number = Math.random() * height.value!;

      speed: number = options.value.defaultSpeed + Math.random() * options.value.addedSpeed;
      directionAngle: number = Math.floor(Math.random() * 360);
      directions: { x: number; y: number } = {
        x: Math.cos(this.directionAngle) * this.speed,
        y: Math.sin(this.directionAngle) * this.speed
      }

      border() {
        if (this.x >= width.value! || this.x <= 0) {
          this.directions.x *= -1;
        }
        if (this.y >= height.value! || this.y <= 0) {
          this.directions.y *= -1;
        }

        this.x > width.value! ? this.x = width.value! : this.x;
        this.y > height.value! ? this.y = height.value! : this.y;

        this.x < 0 ? this.x = 0 : this.x;
        this.y < 0 ? this.y = 0 : this.y;
      }

      update() {
        this.border()
        this.x += this.directions.x;
        this.y += this.directions.y;
      }

      draw() {
        canvas.value.beginPath();
        canvas.value.arc(this.x, this.y, options.value.defaultRadius, 0, Math.PI * 2);
        canvas.value.closePath();
        canvas.value.fillStyle = options.value.particleColor;
        canvas.value.fill();
      }
    }

    const calcDistance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    const drawConnections = (point1: any, father: any[]) => {
      for (let i = 0; i < father.length; i++) {
        const distance = calcDistance(point1.x, point1.y, father[i].x, father[i].y);
        const opacity = 1 - distance / options.value.communicationRadius;

        if (opacity > 0) {
          canvas.value.lineWidth = opacity;
          canvas.value.strokeStyle = "rgba(255,255,255,0.5)";
          canvas.value.beginPath();
          canvas.value.moveTo(point1.x, point1.y);
          canvas.value.lineTo(father[i].x, father[i].y);
          canvas.value.closePath();
          canvas.value.stroke();
        }
      }
    }

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
