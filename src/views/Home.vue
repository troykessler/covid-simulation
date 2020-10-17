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
    const susceptibles = ref<any[]>([])
    const infected = ref<any[]>([])
    const removed = ref<any[]>([])

    const options = ref<any>({
      particleAmount: 200,
      defaultSpeed: 0,
      addedSpeed: 2,

      defaultRadius: 1,

      communicationRadius: Math.pow(20, 2),

      i0: 3,
      r0: 200
    });

    const update = (particle: any) => {
      if (particle.x >= width.value! || particle.x <= 0) {
        particle.directions.x *= -1;
      }
      if (particle.y >= height.value! || particle.y <= 0) {
        particle.directions.y *= -1;
      }

      particle.x > width.value! ? particle.x = width.value! : particle.x;
      particle.y > height.value! ? particle.y = height.value! : particle.y;

      particle.x < 0 ? particle.x = 0 : particle.x;
      particle.y < 0 ? particle.y = 0 : particle.y;

      particle.x += particle.directions.x;
      particle.y += particle.directions.y;
    }

    const draw = (particle: any) => {
      function color() {
        switch(particle.status) {
          case 'S':
            return "#0388fc";
          case 'I':
            return '#fc0328';
          case 'R':
            return '#c2c2c2';
        }
      }

      canvas.value.beginPath();
      canvas.value.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      canvas.value.closePath();
      canvas.value.fillStyle = color();
      canvas.value.fill();
    }

    const loop = () => {
      window.requestAnimationFrame(loop);
      tick.value++;

      canvas.value.fillStyle = "#222";
      canvas.value.fillRect(0, 0, width.value, height.value);

      for(let i = 0; i < susceptibles.value.length; i++){
        update(susceptibles.value[i]);
        draw(susceptibles.value[i]);
      }
      for(let i = 0; i < infected.value.length; i++){
        update(infected.value[i])

        infected.value[i].age++;

        if (infected.value[i].age > options.value.r0) {
          let particle = infected.value[i]
          infected.value.splice(i, 1)
          particle.status = 'R'
          removed.value.push(particle)
        }

        draw(infected.value[i])
      }
      for(let i = 0; i < removed.value.length; i++){
        update(removed.value[i]);
        draw(removed.value[i]);
      }

      for (let a = 0; a < infected.value.length; a++) {
        drawConnections(infected.value[a], susceptibles.value)
      }
    };

    const setup = () => {
      for(let i = 0; i < options.value.particleAmount - options.value.i0; i++){
        susceptibles.value.push(new Particle());
      }
      for(let i = 0; i < options.value.i0; i++){
        infected.value.push(new Particle('I'));
      }
      window.requestAnimationFrame(loop);
    };

    const Particle = class {
      status = 'S';
      age = 0;
      recovery = options.value.r0 + Math.random() * 100

      x: number = Math.random() * width.value!;
      y: number = Math.random() * height.value!;

      speed: number = options.value.defaultSpeed + Math.random() * options.value.addedSpeed;
      directionAngle: number = Math.floor(Math.random() * 360);
      directions: { x: number; y: number } = {
        x: Math.cos(this.directionAngle) * this.speed,
        y: Math.sin(this.directionAngle) * this.speed
      }

      constructor(status: string = 'S') {
        this.status = status
      }
    }

    const calcDistance = (x1: number, y1: number, x2: number, y2: number) => Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);

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

          if (Math.random() < 0.01) {
            let particle =  father[i]
            susceptibles.value.splice(i, 1)
            particle.status = 'I'
            infected.value.push(particle)
          }
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
