<script>
import { Doughnut } from 'vue-chartjs';

export default {
  extends: Doughnut,
  props: {
    memberFreeHoursMap: Object,
  },
  data() {
    return {
      chartdata: {
        labels: Object.keys(this.memberFreeHoursMap),
        datasets: [
          {
            label: 'Data One',
            backgroundColor: [
              '#f87979',
              'lightblue',
              'lightgreen',
              'lightyellow',
              'lightgray',
            ],
            data: Object.values(this.memberFreeHoursMap),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },

  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>

<style>
</style>