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
        height: 250,
        type: 'line',
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
        borderColor: '#a9b3b8',
        strokeDashArray: 1
      },
      stroke: {
        curve: 'straight',
        width: 2
      },
      colors: [STATUS_COLOR.S],
      xaxis: {
        labels: {
          show: false
        }
      },
      series: [
        {
          name: 'Basisreproduktionszahl',
          data: []
        }
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
