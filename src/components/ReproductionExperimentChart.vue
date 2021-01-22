<template>
  <div class="py-32 bg-white">
    <div id="experiment-brn-chart" class="mx-auto block" style="width: 500px" />
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
        id: 'basicReproduction',
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
      colors: [STATUS_COLOR.S, '#f5a742'],
      xaxis: {
        title: {
          text: "Tage"
        },
        tickAmount: 15,
      },
      yaxis: {
        min: 0,
        title: {
          text: "Reproduktionszahl"
        },
        labels: {
          minWidth: 40
        }
      },
      annotations: {
        yaxis: [{
          y: 1,
          borderColor: '#363636',
          strokeDashArray: 0
        }]
      },
      series: [
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
      chart.value = new ApexCharts(document.getElementById('experiment-brn-chart'), chartOptions.value);
      chart.value.render();
    })

    return {
      chart
    }
  }
})
</script>
