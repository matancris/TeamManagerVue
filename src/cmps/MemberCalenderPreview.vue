<template>
  <article class="member-calender-preview calender-preview">
    <div class="style-bg"></div>
    <div class="title-icon-wrapper flex justify-center">
      <img
        v-if="isAdmin"
        src="@/assets/img/drag-icon.png"
        class="handle-dnd"
        title="Drag to switch position"
      />
      <h1 v-if="isAdmin" @click="toggleCalenderOpen">
        {{ member.name + ' Calender' }}
      </h1>
      <h1 v-else>Your Weekly Calender</h1>
    </div>
    <task-list
      v-if="isTasksListOpen"
      :tasks="member.tasks"
      @setSelectedCells="setSelectedCells"
      @cancelCellSelection="cancelCellSelection"
    />
    <transition name="fade">
      <week-table :isCalenderOpen="isCalenderOpen || !isAdmin">
        <tr :key="hour" v-for="hour in hours">
          <th>{{ hour }}</th>
          <td
            :class="[
              checkIsSelectedClass({ day, hour })
                ? 'selected-cell'
                : member.weekTasksMap[day][hour].toLowerCase(),
            ]"
            v-for="day in days"
            :key="day"
            @mouseover="addCellSelected({ day, hour })"
            @mousedown="toggleMouseDown({ day, hour })"
            @mouseup="openTasksOpt(member.tesks)"
          >
            {{ member.weekTasksMap[day][hour] }}
          </td>
        </tr>
      </week-table>
    </transition>
  </article>
</template>

<script>
import TaskList from './TaskList.vue';
import WeekTable from './WeekTable.vue';
export default {
  components: { TaskList, WeekTable },
  props: {
    member: Object,
    days: Array,
    hours: Array,
    isAdmin: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      isCalenderOpen: false,
      // Let the user choose cells with dragging mouse. Preparation for changing calender UX.
      isMouseDown: false,
      selectedCells: [],
      isTasksListOpen: false,
    };
  },
  methods: {
    toggleCalenderOpen() {
      this.isCalenderOpen = !this.isCalenderOpen;
    },
    // Let the user choose cells with dragging mouse. Preparation for changing calender UX.
    addCellSelected(cellData) {
      if (this.isMouseDown) {
        this.selectedCells.push(cellData);
      }
    },
    toggleMouseDown(cellData) {
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
      this.isTasksListOpen = false;
      this.selectedCells.forEach((cell) => {
        const { day, hour } = cell;
        this.member.weekTasksMap[day][hour] = task;
      });
      this.$emit('updateMember', this.member);
      this.selectedCells = [];
    },
    cancelCellSelection() {
      this.selectedCells = [];
      this.isTasksListOpen = false;
    },
  },
  computed: {},
};
</script>

<style>
</style>


