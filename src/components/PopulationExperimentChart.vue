<template>
  <div class="py-32 bg-white">
    <div id="experiment-chart" class="mx-auto block" style="width: 500px" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import ApexCharts from 'apexcharts';
import { STATUS_COLOR } from '@/utils/types';

export default defineComponent({
  props: {
    chartSeries: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const chart = ref<any>(null);

    const chartOptions = ref<any>({
      chart: {
        id: 'population',
        height: 300,
        group: 'covid',
        zoom: {
          enabled: false
        },
        animations: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: '#828b8f',
        strokeDashArray: 1
      },
      stroke: {
        curve: 'straight',
        width: 1.5
      },
      markers: {
        size: 1,
        strokeWidth: 0,
        fillOpacity: 0.5,
      },
      colors: [STATUS_COLOR.S, STATUS_COLOR.I, STATUS_COLOR.R, '#757575', STATUS_COLOR.S, STATUS_COLOR.I, STATUS_COLOR.R, '#757575', STATUS_COLOR.I],
      xaxis: {
        title: {
          text: "Tage"
        },
        tickAmount: 15,
      },
      yaxis: {
        title: {
          text: "Individuen"
        },
        labels: {
          minWidth: 40
        }
      },
      annotations: {
        xaxis: [{
          x: 21,
          borderColor: '#363636',
          strokeDashArray: 2,
        }]
      },
      series: [
        {
          name: "Susceptibles",
          type: "scatter",
          data: [],
        },
        {
          name: "Infected",
          type: "scatter",
          data: [],
        },
        {
          name: "Recovered",
          type: "scatter",
          data: [],
        },
        {
          name: "Diseased",
          type: "scatter",
          data: [],
        },
        {
          name: "Ø Susceptible",
          type: "line",
          data: []
        },
        {
          name: "Ø Infected",
          type: "line",
          data: []
        },
        {
          name: "Ø Recovered",
          type: "line",
          data: []
        },
        {
          name: "Ø Diseased",
          type: "line",
          data: []
        },
      ]
    })

    watch(
      () => props.chartSeries,
      () => {
        chart.value.updateSeries([...props.chartSeries,  {
          name: "Vergleichsdatenset",
          type: "line",
          data: [[0,3],[1,3.2],[2,4],[3,4.6],[4,5.8],[5,6.4],[6,7.6],[7,9.2],[8,10.2],[9,12],[10,13.8],[11,17],[12,21.4],[13,23.4],[14,27.4],[15,32.4],[16,36.2],[17,40.6],[18,45.4],[19,47.6],[20,52.8],[21,57.4],[22,64.8],[23,71],[24,78],[25,85],[26,91.6],[27,99],[28,107],[29,114.4],[30,117],[31,118.2],[32,125],[33,130.6],[34,133.2],[35,137.4],[36,142.8],[37,147.8],[38,150],[39,151.8],[40,154.6],[41,152.4],[42,149.8],[43,149.2],[44,148],[45,143.2],[46,138],[47,130.6],[48,124.6],[49,120.8],[50,118.4],[51,112],[52,104.4],[53,99.2],[54,93.6],[55,84.6],[56,76.2],[57,70.4],[58,64.6],[59,57.6],[60,52.4],[61,48.2],[62,41.8],[63,35.4],[64,32],[65,29],[66,27],[67,24.2],[68,22.2],[69,19.8],[70,17.6],[71,15.8],[72,13.8],[73,11.6],[74,11.4],[75,10.2],[76,8.6],[77,7.2],[78,6],[79,5.8],[80,5.2],[81,4.6],[82,4],[83,4.2],[84,4],[85,3.6],[86,3.4],[87,3.4],[88,2.6],[89,2.4],[90,2.2],[91,2],[92,2.3],[93,1.5],[94,1.3],[95,1.7],[96,1.7],[97,1.7],[98,1],[99,1.5],[100,1.5],[101,1.5],[102,1],[103,2],[104,2],[105,1],[106,1],[107,1],[108,1],[109,1],[110,0]]
        }]);
      },
      {
        deep: true
      }
    )
    
    onMounted(() => {
      chart.value = new ApexCharts(document.getElementById('experiment-chart'), chartOptions.value);
      chart.value.render();
    })

    return {
      chart
    }
  }
})
</script>
