<template>
  <section class="task-list-wrapper flex column">
    <section class="task-list flex space-around flex-wrap">
      <h5 v-for="task in tasks" :key="task" @click="setSelectedCells(task)">
        {{ task }}
      </h5>
    </section>
    <h5 class="cancel-btn" @click="onCancelCellSelection">cancel</h5>
  </section>
</template>

<script>
export default {
  props: {
    tasks: Array,
  },
  methods: {
    setSelectedCells(task) {
      this.$emit('setSelectedCells', task);
    },
    onCancelCellSelection() {
      this.$emit('cancelCellSelection');
    },
  },
};
</script>

<style>
</style>