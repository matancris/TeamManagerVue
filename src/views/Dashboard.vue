<template>
  <section class="dashboard main-container">
    <div class="dashboard-wrapper">
      <article class="dashboard-summary flex space-between">
        <div>
          <h3>Instructors Number</h3>
          <h2>{{ membersToShow.length }}</h2>
        </div>
        <div>
          <h3>Hours in Queue</h3>
          <h2>{{ getHoursPerTaskCount('Queue') }}</h2>
        </div>
        <div>
          <h3>Average Work Hours</h3>
          <h2>{{ AvgWorkHoursPerPers }}</h2>
        </div>
      </article>
      <article class="task-chart">
        <h2>Members Task per Hour</h2>
        <bar-chart
          v-if="memberFreeHoursMap['Hadas']"
          class="bar-chart"
          :memberQueueHoursMap="memberQueueHoursMap"
          :memberLeadsHoursMap="memberLeadsHoursMap"
          :memberProgHoursMap="memberProgHoursMap"
          :memberOpeningHoursMap="memberOpeningHoursMap"
        />
      </article>
      <article class="free-time-chart">
        <h2>Members free time (hours per week)</h2>
        <pie-chart
          v-if="memberFreeHoursMap['Hadas']"
          class="bar-chart"
          :memberFreeHoursMap="memberFreeHoursMap"
        />
      </article>
    </div>
  </section>
</template>

<script>
import PieChart from '../cmps/chart/PieChart.vue';
import BarChart from '../cmps/chart/BarChart.vue';

export default {
  async created() {
    await this.loadMembers();
  },
  methods: {
    async loadMembers() {
      await this.$store.dispatch({ type: 'loadMembers' });
    },
    getHoursPerTaskCount(task) {
      console.log('hoursPerTaskCount ~ task', task);
      const hoursPerTaskMap = this.$store.getters.memberHoursMap(task);
      return Object.values(hoursPerTaskMap).reduce((sum, hourCount) => {
        sum += hourCount;
        return sum;
      }, 0);
    },
  },
  computed: {
    membersToShow() {
      return this.$store.getters.members;
    },
    memberFreeHoursMap() {
      return this.$store.getters.memberHoursMap('Free');
    },
    memberQueueHoursMap() {
      return this.$store.getters.memberHoursMap('Queue');
    },
    memberLeadsHoursMap() {
      return this.$store.getters.memberHoursMap('Leads');
    },
    memberProgHoursMap() {
      return this.$store.getters.memberHoursMap('MisterBit');
    },
    memberOpeningHoursMap() {
      return this.$store.getters.memberHoursMap('Opening');
    },
    AvgWorkHoursPerPers() {
      const queueHoursCount = this.getHoursPerTaskCount('Queue');
      const leadsHoursCount = this.getHoursPerTaskCount('Leads');
      const programmingHoursCount = this.getHoursPerTaskCount('MisterBit');
      const openingHoursCount = this.getHoursPerTaskCount('Opening');
      const hoursSum =
        queueHoursCount +
        leadsHoursCount +
        programmingHoursCount +
        openingHoursCount;
      return (hoursSum / this.membersToShow.length).toFixed(2);
    },
  },
  components: {
    PieChart,
    BarChart,
  },
};
</script>
