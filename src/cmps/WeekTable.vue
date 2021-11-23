<template>
  <table v-if="isCalenderOpen">
    <thead>
      <tr>
        <th></th>
        <th v-for="day in days" :key="day">{{ day }}</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="isEmptyCalender">
        <tr :key="hour" v-for="hour in hours">
          <th>{{ hour }}</th>
          <td
            v-for="day in days"
            :key="day"
            :class="[
              checkIsSelectedClass({ day, hour }) ? 'selected-cell' : weekTasksMap[day][hour].toLowerCase(),
            ]"
            @mouseover="addCellSelected({ day, hour })"
            @mousedown="toggleMouseDown({ day, hour })"
            @mouseup="openTasksOpt()"
          >
            {{ weekTasksMap[day][hour] }}
          </td>
        </tr>
      </template>
      <slot v-else></slot>
    </tbody>
  </table>
</template>

<script>
import { teamService } from '../services/teamService';
export default {
  props: {
    isCalenderOpen: Boolean,
    isEmptyCalender: Boolean,
    cancelSelection: Function,
    weekTasksMap: Object,
  },
  data() {
    return {
      days: teamService.getWeekData().days,
      hours: teamService.getWeekData().hours,
      isMouseDown: false,
      selectedCells: [],
      isTasksListOpen: false,
    };
  },
  // created() {
  // },
  methods: {
    addCellSelected(cellData) {
      if (this.isMouseDown) {
        console.log('Selected');
        this.selectedCells.push(cellData);
      }
    },
    toggleMouseDown(cellData) {
      console.log('MouseDown');
      this.isMouseDown = true;
      this.addCellSelected(cellData);
    },

    checkIsSelectedClass(cellData) {
      const { day, hour } = cellData;
      return !!this.selectedCells.find(
        (selectedCell) => selectedCell.hour === hour && selectedCell.day === day
      );
    },
    openTasksOpt() {
      this.isMouseDown = false;
      this.isTasksListOpen = true;
    },
    setSelectedCells(task) {
      this.selectedCells.forEach((cell) => {
        const { day, hour } = cell;
        this.weekTasksMap[day][hour] = task;
      });
      this.$emit('setMemberReq', this.weekTasksMap);
      this.selectedCells = [];
    },
    cancelCellSelection() {
      this.selectedCells = [];
      this.isTasksListOpen = false;
    },
  },
};
</script>
