<template>
  <div>
    <div id="simulation-window"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import P5 from 'p5';

class People {
  x: any
  y: any
  diameter: any
  xSpeed: any
  ySpeed: any
  fill: any
  radius: any
  sick: any

  constructor() {
    //all variables declared in here by this.
    this.x = Math.random() * 500;
    this.y = Math.random() * 500;
    this.diameter = 3;
    this.xSpeed = (Math.random() - 1);
    this.ySpeed = (Math.random() - 1);
    this.fill = "white";
    this.radius = 3;
    this.sick = false;
  }
  move() {
    var speedMultiplier = 1;
    this.x += this.xSpeed * speedMultiplier;
    this.y += this.ySpeed * speedMultiplier;
    //safety so can't go out
    if (this.x >= 500) this.xSpeed = -this.xSpeed;
    if (this.x <= 0) this.xSpeed = -this.xSpeed;
    if (this.y >= 500) this.ySpeed = -this.ySpeed;
    if (this.y <= 0) this.ySpeed = -this.ySpeed;
  }
  infected() {
    //set if loop then make bool false for reset
    this.fill = "red";
    this.sick = true;
  }
  intersects(other: any) {
    var d = Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
    return d < this.radius;
  }
  cured() {
    this.fill = "white";
    this.sick = false;
  }
}

export default defineComponent({
  setup() {
    const sketch = (p5: any) => {

      let person: any;
      //array
      let people: any[] = [];

      let create: any = true;

      let corona: any;

      function virus() {
        people[0].infected();
        for (var i = 0; i < people.length; i++) {
          //runs through the array and does both functions for all objects
          people[i].move();
          p5.fill(people[i].fill);
          p5.ellipse(people[i].x, people[i].y, people[i].diameter, people[i].diameter);
        }
        for (var i = 0; i < people.length; i++) {
          for (var j = 0; j < people.length; j++) {
            if (j != i && people[i].intersects(people[j]) && people[j].sick == true) {
              people[i].infected();
            }
          }
        }
      }

      p5.setup = () => {
        p5.createCanvas(500, 500);

        for (let i = 0; i < 1000; i++) {
          people.push(new People());
        }
      };

      p5.draw = () => {
        p5.background(33, 33, 33);
        virus();
      };
    }

    onMounted(() => {
      new P5(sketch, 'simulation-window');
    })

    return {}
  }
});
</script>

<style>
#simulation-window {
  width: 500px !important;
  height: 500px !important;
  border: 2px solid white;
  margin: 100px auto;
}
</style>
