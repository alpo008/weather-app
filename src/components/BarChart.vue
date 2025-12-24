<template>
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="history"
  />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
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