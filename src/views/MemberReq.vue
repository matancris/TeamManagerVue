<template>
  <section class="member-req main-container">
    <section
      class="member-req-list"
      v-for="(member, idx) in membersWithRequests"
      :key="member._id"
    >
      <member-calender-preview
        :days="weekData.days"
        :hours="weekData.hours"
        :member="member"
      />
      <week-table
        v-if="adminRequests[idx]"
        :isCalenderOpen="true"
        :isEmptyCalender="true"
        :weekTasksMap="adminRequests[idx].reqCal"
      />
      <section class="request-actions">
        <button @click="onConfirmReq(adminRequests[idx])">Confirm</button>
        <button>Deny</button>
      </section>
    </section>
    <h1 v-if="!membersWithRequests.length">There are no requests!</h1>
  </section>
</template>

<script>
import MemberCalenderPreview from '../cmps/MemberCalenderPreview.vue';
import WeekTable from '../cmps/WeekTable.vue';
import { teamService } from '../services/teamService';

export default {
  components: {
    MemberCalenderPreview,
    //    MemberReqCalender,
    WeekTable,
  },
  data() {
    return {
      weekData: teamService.getWeekData(),
      requests: [],
    };
  },
  created() {
    this.requests = this.loggedinUser.requests;
  },
  methods: {
    onConfirmReq(memberReq) {
      console.log('onConfirmReq ~ memberReq', memberReq);
      this.$store.dispatch({ type: 'mergeMemberCal', memberReq });
    },
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    adminRequests() {
      return this.$store.getters.adminRequests;
    },
    membersWithRequests() {
      console.log('this.loggedinUser', this.loggedinUser);
      const currRequests = this.adminRequests.map((request) => request.member);
      console.log('memberReqList ~ currRequests', currRequests);
      return currRequests;
    },
  },
};
</script>

<style>
</style>