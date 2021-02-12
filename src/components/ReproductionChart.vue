<template>
  <div id="brn-chart" class="mx-auto block" />
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
        height: 250,
        type: 'line',
        group: 'covid',
        foreColor: '#ffffff',
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
        width: 2
      },
      colors: [STATUS_COLOR.S, '#ffc73b'],
      xaxis: {
        labels: {
          show: false
        }
      },
      yaxis: {
        min: 0,
        labels: {
          minWidth: 40
        }
      },
      annotations: {
        yaxis: [{
          y: 1,
          borderColor: '#ffffff',
          strokeDashArray: 0
        }]
      },
      series: [
        {
          name: 'Basisreproduktionszahl',
          data: []
        },
        {
          name: 'Nettoreproduktionszahl',
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
      chart.value = new ApexCharts(document.getElementById('brn-chart'), chartOptions.value);
      chart.value.render();
    })

    return {
      chart
    }
  }
})
</script>
