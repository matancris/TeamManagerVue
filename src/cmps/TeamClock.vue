<template>
  <section class="team-clock">
    <transition-group name="fade" v-if="hour">
      <article class="clock" key="clock">
        <span>{{ hourToShow }}</span>
        <span>{{ minToShow }}</span>
        <span>{{ secToShow }}</span>
      </article>

      <team-status
        key="team-status" 
        v-if="taskNumMap['Sunday']"
        :taskNumMap="taskNumMap"
        :hour="hourToShow"
        :days="days"
      />
    </transition-group>
    <loader v-else />
  </section>
</template>

<script>
import TeamStatus from './TeamStatus.vue';
import Loader from './Loader.vue';

export default {
  components: { TeamStatus, Loader },
  props: {
    taskNumMap: Object,
    days: Array,
  },
  data() {
    return {
      hour: '',
      minute: '',
      second: '',
      intervalId: null,
    };
  },
  created() {
    this.intervalId = setInterval(() => {
      this.hour = new Date(Date.now()).getHours() + ''; // Convert to string for consistant type of variable when sending it to the team-status component
      this.minute = new Date(Date.now()).getMinutes();
      this.second = new Date(Date.now()).getSeconds();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  computed: {
    hourToShow() {
      return +this.hour >= 10 ? this.hour : '0' + this.hour;
    },
    minToShow() {
      return +this.minute >= 10 ? this.minute : '0' + this.minute;
    },
    secToShow() {
      return +this.second >= 10 ? this.second : '0' + this.second;
    },
  },
};
</script>

<style>
</style>