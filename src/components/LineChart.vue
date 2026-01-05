<template>
  <Line
    id="history_chart"
    :options="chartOptions"
    :data="history"
    width="100%"
  />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default {
  name: 'LineChart',
  components: { Line },
  props: ['history'],
  data() {
    return {
      chartOptions: {
        responsive: true,
      }
    }
  },
  beforeCreate(){
  },
  mounted() {
  }
}
</script>

<style scoped>
  #history_chart {
    height: auto!IMPORTANT;
    width: 100%!IMPORTANT;
  }
</style>