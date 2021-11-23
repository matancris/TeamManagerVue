<template>
  <section class="member-req-calender">
    <task-list
      :tasks="['Personal', '-']"
      @setSelectedCells="OnSetSelectedCells"
      @cancelCellSelection="OnCancelCellSelection"
    />
    <week-table
      :isEmptyCalender="true"
      :isCalenderOpen="true"
      :weekTasksMap="weekTasksMap"
      @setMemberReq="setMemberReq"
    ></week-table>
    <button class="send-req-btn" @click="onSendReqCal">Send Requests!</button>
  </section>
</template>

<script>
import { teamService } from '../services/teamService';
import TaskList from './TaskList.vue';
import WeekTable from './WeekTable.vue';
export default {
  components: { WeekTable, TaskList },
  props: {
    member: Object,
    isAdmin: Boolean,
  },
  data() {
    return {
      weekTasksMap: teamService.getWeekTasksMap(true),
      memberReqCal: {},
    };
  },
  methods: {
    OnCancelCellSelection() {
      this.$children[1].cancelCellSelection();
    },
    OnSetSelectedCells(task) {
      this.$children[1].setSelectedCells(task);
    },
    setMemberReq(memberReqCal) {
      this.memberReqCal = memberReqCal;
    },
    onSendReqCal() {
      this.$emit('sendReqCal', {
        member: this.member,
        reqCal: this.memberReqCal,
      });
    },
  },
};
</script>

<style>
</style>