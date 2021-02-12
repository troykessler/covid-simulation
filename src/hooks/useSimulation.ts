import { Particle } from "@/utils/Particle.class";
import { IOptions, STATUS, STATUS_COLOR } from "@/utils/types";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import P5 from "p5";

export function useSimulation(name: string, options: IOptions) {
  const play = ref<boolean>(true);
  const stop = ref<boolean>(false);
  const p5sketch = ref<any>(null);

  const simulationExperimentMode: boolean = false;
  const simulationRuns: number = 1;
  const simulationCounter = ref<number>(0);

  let particles: Particle[] = [];
  
  const susceptibles = ref<number>(options.amountParticles - options.i0);
  const infected = ref<number>(options.i0);
  const recovered = ref<number>(0);
  const diseased = ref<number>(0);

  const counter = ref<number>(0);
  const basicReproduction = ref<number | null>(0);
  const effectiveReproduction = ref<number | null>(0);

  const reproductionSeries = ref<any[]>([
    {
      name: "Basisreproduktionszahl",
      data: [],
    },
    {
      name: "Nettoreproduktionszahl",
      data: [],
    },
  ]);

  const experimentReproductionSeries = ref<any[]>([
    {
      name: 'Basisreproduktionszahl',
      type: 'scatter',
      data: []
    },
    {
      name: 'Nettoreproduktionszahl',
      type: 'scatter',
      data: []
    },
    {
      name: 'Ø Basisreproduktionszahl',
      type: 'line',
      data: []
    },
    {
      name: 'Ø Nettoreproduktionszahl',
      type: 'line',
      data: []
    },
  ])

  const dataSeries = ref<any[]>([
    {
      name: "Anfällig",
      data: [],
    },
    {
      name: "Infiziert",
      data: [],
    },
    {
      name: "Erholt",
      data: [],
    },
    {
      name: "Verstorben",
      data: [],
    },
  ]);

  const experimentDataSeries = ref<any[]>([
    {
      name: "Anfällig",
      type: "scatter",
      data: [],
    },
    {
      name: "Infiziert",
      type: "scatter",
      data: [],
    },
    {
      name: "Erholt",
      type: "scatter",
      data: [],
    },
    {
      name: "Verstorben",
      type: "scatter",
      data: [],
    },
    {
      name: "Ø Anfällig",
      type: "line",
      data: []
    },
    {
      name: "Ø Infiziert",
      type: "line",
      data: []
    },
    {
      name: "Ø Erholt",
      type: "line",
      data: []
    },
    {
      name: "Ø Verstorben",
      type: "line",
      data: []
    },
  ])

  watch(() => options.socialDistancingParticipation, () => {
    particles.forEach((particle: Particle) => particle.obeysSocialDistancing = Math.random() < options.socialDistancingParticipation)
  });

  watch(() => options.maskParticipation, () => {
    particles.forEach((particle: Particle) => particle.wearsMask = Math.random() < options.maskParticipation)
  });

  const updateChart = () => {
    dataSeries.value[0].data = [
      ...dataSeries.value[0].data,
      susceptibles.value,
    ];
    dataSeries.value[1].data = [
      ...dataSeries.value[1].data,
      infected.value,
    ];
    dataSeries.value[2].data = [
      ...dataSeries.value[2].data,
      recovered.value,
    ];
    dataSeries.value[3].data = [
      ...dataSeries.value[3].data,
      diseased.value,
    ];

    reproductionSeries.value[0].data = [
      ...reproductionSeries.value[0].data,
      basicReproduction.value,
    ];
    reproductionSeries.value[1].data = [
      ...reproductionSeries.value[1].data,
      effectiveReproduction.value,
    ];
  };

  const sketch = (p5: any) => {

    function loop() {
      const ops: IOptions = options;

      if (ops.centralLocations) {
        ops.centralLocations.forEach((location) => {
          if (
            location.particles.length < options.centralCapacity!
          ) {
            const particlesInRadius = particles.filter(
              (particle) =>
                particle.distance(location.center.x, location.center.y) <
                options.centralRadius!
            );

            if (particlesInRadius.length) {
              const particleIndex = Math.floor(
                Math.random() * particlesInRadius.length
              );
              location.particles.unshift(particlesInRadius[particleIndex]);
              particlesInRadius[particleIndex].travelTo(
                location.center.x,
                location.center.y,
                0
              );
            }
          } else if (Math.random() < options.centralExchange!) {
            if (
              !location.particles[options.centralCapacity! - 1]
                .travelling
            ) {
              const particle = location.particles.pop();
              const ang = 2 * Math.PI * Math.random() - Math.PI;
              const x =
                location.center.x +
                Math.cos(ang) *
                  options.centralRadius! *
                  Math.random();
              const y =
                location.center.y +
                Math.sin(ang) *
                  options.centralRadius! *
                  Math.random();
              particle?.travelTo(x, y, options.speed);
            }
          }
        });
      }


      if (ops.communities && counter.value % 24 === 0) {
        for (let i = 0; i < ops.travelsPerDay!; i++) {
          const x = Math.random() * ops.width;
          const y = Math.random() * ops.height;
          const particle = particles[Math.floor(Math.random() * ops.amountParticles)];

          if (particle.status !== STATUS.D && particle.status !== STATUS.Q) {
            particle.travelTo(x, y, ops.speed);
          }
        }
      }

      if (ops.quarantine && counter.value % 24 === 0) {
        let testSubjects: Particle[] = []

        while (testSubjects.length < ops.testsPerDay) {
          const particle = particles[Math.floor(Math.random() * ops.amountParticles)];

          if (!testSubjects.includes(particle)) {
            testSubjects.push(particle)
          }
        }

        testSubjects.forEach((particle: Particle) => {
          if (particle.status === STATUS.I) {
            particle.status = STATUS.Q;
            particle.d.x = 0;
            particle.d.y = 0;
          }
        })
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].move(ops, particles);

        if (
          (particles[i].status === STATUS.I || particles[i].status === STATUS.Q) &&
          particles[i].duration > ops.recoveryRate
        ) {
          if (Math.random() < ops.deathRate) {
            particles[i].status = STATUS.D;
            particles[i].d.x = 0;
            particles[i].d.y = 0;
            infected.value--;
            diseased.value++;
          } else {
            if (particles[i].status === STATUS.Q) {
              const directions = (2 * Math.PI * Math.random()) - Math.PI;
              particles[i].d.x = Math.cos(directions) * ops.speed;
              particles[i].d.y = Math.sin(directions) * ops.speed;
            }

            particles[i].status = STATUS.R;
            infected.value--;
            recovered.value++;
          }
        }

        p5.fill(STATUS_COLOR[particles[i].status]);
        p5.stroke(0, 0, 0);
        p5.ellipse(
          particles[i].x,
          particles[i].y,
          options.size,
          options.size
        );
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = 0; j < particles.length; j++) {
          if (i !== j) {
            let particleI: Particle = particles[i];
            let particleJ: Particle = particles[j];

            if (particleI.status === STATUS.I) {
              if (
                particleI.distance(particleJ.x, particleJ.y) <
                ops.infectionRadius
              ) {
                particleI.contactList = {
                  ...particleI.contactList,
                  [particleJ.id]: particleJ,
                };
              } else if (particleI.contactList[particleJ.id]) {
                if (particleI.contactList[particleJ.id].status === STATUS.S) {
                  if (particleI.sectorId === particleJ.sectorId) {
                    if (Math.random() < (particleI.wearsMask ? ops.maskInfectionRate : ops.infectionRate)) {
                      particleJ.status = STATUS.I;
                      infected.value++;
                      susceptibles.value--;
                    }
                  }
                  particleI.effectiveContacts++;
                }
                delete particleI.contactList[particleJ.id];
                particleI.basicContacts++;
              }
            }
          }
        }
      }

      const realInfectionRate = 
        ((options.maskParticipation * options.maskInfectionRate) + ((1 - options.maskParticipation) * options.infectionRate));

      if (infected.value) {
        const effectiveContacts =
          particles
            .filter((p) => p.status === STATUS.I)
            .reduce(
              (sum: number, p: Particle) =>
                sum + p.effectiveContacts * (ops.recoveryRate / p.duration),
              0
            ) / infected.value;

        const basicContacts =
          particles
            .filter((p) => p.status === STATUS.I)
            .reduce(
              (sum: number, p: Particle) =>
                sum + p.basicContacts * (ops.recoveryRate / p.duration),
              0
            ) / infected.value;

        effectiveReproduction.value = parseFloat(
          (effectiveContacts * realInfectionRate).toFixed(2)
        );
        basicReproduction.value = parseFloat(
          (basicContacts * realInfectionRate).toFixed(2)
        );
      } else {
        effectiveReproduction.value = null;
        basicReproduction.value = null;
      }
    }

    p5.setup = () => {
      p5.createCanvas(options.width, options.height);
      particles = [];

      for (
        let i = 0;
        i < options.amountParticles - options.i0;
        i++
      ) {
        particles.push(new Particle(i, STATUS.S, options));
      }

      for (let i = 0; i < options.i0; i++) {
        particles.push(
          new Particle(
            options.amountParticles + i,
            STATUS.I,
            options
          )
        );
      }
    };

    p5.draw = () => {
      if (stop.value) {
        p5.remove();
      } else if (play.value) {
        p5.background(33, 33, 33);

        if (options.centralLocations) {
          options.centralLocations.forEach((location) => {
            p5.fill("rgba(0,0,0,0)");
            p5.stroke("white");
            p5.circle(location.center.x, location.center.y, 30, 30);
          });
        }

        if (options.communities) {
          const communityWidth = options.width / options.communities;

          for (let x = 1; x < options.communities; x++) {
            p5.stroke("white");
            p5.strokeWeight(1);
            p5.line(x * communityWidth, 0, x * communityWidth, 500);
          }

          for (let y = 1; y < options.communities; y++) {
            p5.stroke("white");
            p5.strokeWeight(1);
            p5.line(0, y * communityWidth, 500, y * communityWidth);
          }
        }

        loop();

        if (counter.value % 24 === 0) {
          updateChart();
        }

        counter.value++;

        if (counter.value === 21 * 24) {
          options.travelsPerDay = 0;
        }

        if (!infected.value) {
          updateChart();
          play.value = false;

          if (simulationExperimentMode) {
            if (simulationCounter.value < simulationRuns) {
              simulationCounter.value++;
  
              for (let i = 0; i < 4; i++) {
                experimentDataSeries.value[i].data = [
                  ...experimentDataSeries.value[i].data,
                  ...dataSeries.value[i].data.map((d: any, index: number) => [index, d])
                ]
  
                let averageCounter = 0
                let aggregatedAverage = []
                let averageData = []
  
                do {
                  aggregatedAverage = experimentDataSeries.value[i].data.filter((d: number[]) => d[0] === averageCounter)
  
                  if (aggregatedAverage.length) {
                    averageData.push([averageCounter, Number((aggregatedAverage.reduce((sum: number, d: number[]) => sum + d[1], 0) / aggregatedAverage.length).toFixed(1))])
                  }
                  averageCounter++;
                } while (aggregatedAverage.length);
  
                experimentDataSeries.value[i + 4].data = [...averageData];
              }
  
              for (let i = 0; i < 2; i++) {
                experimentReproductionSeries.value[i].data = [
                  ...experimentReproductionSeries.value[i].data,
                  ...reproductionSeries.value[i].data.map((d: any, index: number) => [index, d])
                ]
  
                let averageCounter = 0
                let aggregatedAverage = []
                let averageData = []
  
                do {
                  aggregatedAverage = experimentReproductionSeries.value[i].data.filter((d: number[]) => d[0] === averageCounter)
  
                  if (aggregatedAverage.length) {
                    averageData.push([averageCounter, Number((aggregatedAverage.reduce((sum: number, d: number[]) => sum + d[1], 0) / aggregatedAverage.length).toFixed(1))])
                  }
                  averageCounter++;
                } while (aggregatedAverage.length);
  
                experimentReproductionSeries.value[i + 2].data = [...averageData];
              }
  
              console.log(JSON.stringify(experimentDataSeries.value[5].data))
              console.log(JSON.stringify(experimentDataSeries.value[7].data))
              console.log(JSON.stringify(experimentReproductionSeries.value[3].data))
  
              if (simulationCounter.value !== simulationRuns) {
                options.travelsPerDay = 15;
                restartSimulation();
              }
            }
          }
        }
      }
    };
  };

  const restartSimulation = () => {
    play.value = true;
    counter.value = 0;

    if (options.centralLocations) {
      options.centralLocations!.forEach((location) => {
        location.particles = []
      })
    }

    dataSeries.value = [
      {
        name: "Anfällig",
        data: [],
      },
      {
        name: "Infiziert",
        data: [],
      },
      {
        name: "Erholt",
        data: [],
      },
      {
        name: "Verstorben",
        data: [],
      },
    ];

    reproductionSeries.value = [
      {
        name: "Basisreproduktionszahl",
        data: [],
      },
      {
        name: "Nettoreproduktionszahl",
        data: [],
      },
    ];

    susceptibles.value = options.amountParticles - options.i0;
    infected.value = options.i0;
    recovered.value = 0;
    diseased.value = 0;

    p5sketch.value.setup();
  };

  onMounted(() => {
    p5sketch.value = new P5(sketch, name);
  });

  onBeforeUnmount(() => {
    stop.value = true;
  });

  return {
    susceptibles,
    infected,
    recovered,
    diseased,
    play,
    restartSimulation,
    dataSeries,
    basicReproduction,
    reproductionSeries,
    experimentDataSeries,
    experimentReproductionSeries,
    simulationExperimentMode
  }
}
