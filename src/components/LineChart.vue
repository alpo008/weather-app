<template>
  <Line
    id="my-chart-id"
    :options="chartOptions"
    :data="history"
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
      chartData: {
        labels: ['2025.11.23','2025.11.23','2025.11.24','2025.11.24',],
        datasets: [{data: [1, 4, -5, 9],       borderColor: '#36A2EB',
      backgroundColor: '#9BD0F5',}]
      },
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