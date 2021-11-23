<template>
  <section class="team-app main-container">
    <team-clock :taskNumMap="taskNumMap" :days="weekData.days" />
    <template v-if="isLoggedinAdmin">
      <div class="actions-container flex justify-center align-center">
        <button class="generate-btn" @click="OnGerateCalender">
          Auto Generate
        </button>
        <calender-edit
          v-if="membersToShow.length"
          :members="membersToShow"
          :days="weekData.days"
          :hours="weekData.hours"
          :tasks="memberTasks"
          @updateCalender="updateCalender"
          @changeMember="changeSelectedMember"
        />
      </div>
      <team-calender-preview
        v-if="taskNumMap['Sunday']"
        :taskNumMap="taskNumMap"
        :days="weekData.days"
        :hours="weekData.hours"
      />
      <member-calender-list
        :members="membersToShow"
        :days="weekData.days"
        :hours="weekData.hours"
        @updateMember="updateMember"
      />
    </template>
    <template v-else-if="memberByLoggedinUser">
      <member-calender-preview
        :member="memberByLoggedinUser"
        :days="weekData.days"
        :hours="weekData.hours"
        :isAdmin="false"
        @updateMember="updateMember"
      />
      <member-req-calender
        :member="memberByLoggedinUser"
        @sendReqCal="sendReqCal"
      />
    </template>
  </section>
</template>

<script>
import { teamService } from '../services/teamService.js';
import CalenderEdit from './CalenderEdit.vue';
import MemberCalenderList from '../cmps/MemberCalenderList.vue';
import MemberCalenderPreview from '../cmps/MemberCalenderPreview.vue';
import TeamCalenderPreview from '../cmps/TeamCalenderPreview.vue';
import TeamClock from '../cmps/TeamClock.vue';
import MemberReqCalender from '../cmps/MemberReqCalender.vue';

export default {
  data() {
    return {
      weekData: teamService.getWeekData(),
      selectedMember: null,
    };
  },
  components: {
    CalenderEdit,
    MemberCalenderList,
    MemberCalenderPreview,
    TeamCalenderPreview,
    TeamClock,
    MemberReqCalender,
  },
  async created() {
    await this.loadMembers();
    // this.selectedMember = this.membersToShow.find(
    //   (member) => member._id === this.membersToShow[0].id
    // ); // default member Id (Hadas)
    console.log('membersToShow', this.membersToShow);
  },
  methods: {
    updateCalender(data) {
      this.$store.dispatch({ type: 'updateCalender', data });
    },
    async loadMembers() {
      await this.$store.dispatch({ type: 'loadMembers' });
    },
    async changeSelectedMember(memberId) {
      this.selectedMember = this.membersToShow.find(
        (member) => member._id === memberId
      );
    },
    updateMember(updatedMember) {
      this.$store.dispatch({ type: 'updateMember', member: updatedMember });
    },
    OnGerateCalender() {
      this.$store.dispatch({ type: 'generateMembersCalenders' });
    },
    sendReqCal(memberReq) {
      console.log('ev', memberReq);
      this.$store.dispatch({ type: 'addReqToAdmin', memberReq });
    },
  },
  computed: {
    membersToShow() {
      return this.$store.getters.members;
    },
    memberTasks() {
      return this.selectedMember?.tasks || [];
    },
    taskNumMap() {
      return this.$store.getters.taskNumMap;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    isLoggedinAdmin() {
      return this.loggedinUser?.isAdmin;
    },
    memberByLoggedinUser() {
      console.log('this.loggedin', this.loggedinUser);
      return this.membersToShow.find(
        (member) => member._id === this.loggedinUser.memberId
      );
    },
  },
};
</script>
