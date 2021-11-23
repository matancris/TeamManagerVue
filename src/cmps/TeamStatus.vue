<template>
  <section class="team-status flex column justify-center">
    <h1>status:</h1>
    <article
      class="task-list-status flex space-around flex-wrap"
      v-if="taskNumMap[day] && taskNumMap[day][hour + ':00']"
    >
      <h5
        v-for="(value, task) in taskNumMap[day][hour + ':00']"
        :key="task"
        :title="value.members"
      >
        {{ task + ': ' + value.members.length }}
      </h5>
    </article>

    <h5 v-else>Off work for now</h5>
  </section>
</template>

<script>
export default {
  props: {
    taskNumMap: Object,
    hour: String,
    days: Array,
  },
  data() {
    return {
      day: '',
    };
  },
  created() {
    const dayNum = new Date(Date.now()).getDay();
    this.day = this.days[dayNum];
  },
};
</script>

<style>
</style>