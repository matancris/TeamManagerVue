<script>
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  props: {
    memberQueueHoursMap: Object,
    memberLeadsHoursMap: Object,
    memberProgHoursMap: Object,
    memberOpeningHoursMap: Object,
  },
  data() {
    return {
      chartdata: {
        labels: Object.keys(this.memberQueueHoursMap),
        datasets: [
          {
            label: 'Queue',
            backgroundColor: '#f87979',
            data: Object.values(this.memberQueueHoursMap),
          },
          {
            label: 'Leads',
            backgroundColor: 'lightblue',
            data: Object.values(this.memberLeadsHoursMap),
          },
          {
            label: 'MisterBit',
            backgroundColor: 'lightyellow',
            data: Object.values(this.memberProgHoursMap),
          },
          {
            label: 'Opening',
            backgroundColor: 'lightgreen',
            data: Object.values(this.memberOpeningHoursMap),
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