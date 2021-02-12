<template>
  <div id="chart" class="mx-auto block" />
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
      colors: [STATUS_COLOR.S, STATUS_COLOR.I, STATUS_COLOR.R, STATUS_COLOR.D],
      xaxis: {
        labels: {
          show: false
        }
      },
      yaxis: {
        labels: {
          minWidth: 40
        }
      },
      series: [
        {
          name: 'Anfällig',
          data: []
        },
        {
          name: 'Infiziert',
          data: []
        },
        {
          name: 'Erholt',
          data: []
        },
        {
          name: 'Verstorben',
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
      chart.value = new ApexCharts(document.getElementById('chart'), chartOptions.value);
      chart.value.render();
    })

    return {
      chart
    }
  }
})
</script>
