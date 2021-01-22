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
      colors: [STATUS_COLOR.S, STATUS_COLOR.I, STATUS_COLOR.R, '#757575'],
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
        chart.value.updateSeries(props.chartSeries);
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
