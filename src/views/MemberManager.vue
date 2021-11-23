<template>
  <section class="member-manager main-container">
    <button
      class="add-modal-btn"
      :class="{ 'modal-open': isAddFormOpen }"
      @click="toggleAddForm"
    >
      +
    </button>
    <transition name="fade">
      <!-- <my-modal :isModalOpen="isAddFormOpen"> -->
      <section
        class="add-form-wrapper flex align-center justify-center"
        v-if="isAddFormOpen"
      >
        <form
          class="add-form flex column align-center space-around"
          tabindex="0"
          ref="addForm"
          @submit="addMember"
          @blur="toggleAddForm"
        >
          <h5 for="member-name">Add Member</h5>
          <my-input
            type="text"
            id="member-name"
            v-model="newMemberName"
            :isRequired="true"
            label="Name"
          />
          <button class="add-member-btn">add Member</button>
        </form>
      </section>
      <!-- </my-modal> -->
    </transition>
    <member-list
      :members="membersToShow"
      :tasks="tasks"
      @memberTasksUpdate="memberTasksUpdate"
      @removeMember="removeMember"
    />
  </section>
</template>

<script>
import MyInput from '../cmps/custom/MyInput.vue';
import MemberList from '../cmps/MemberList.vue';
import { teamService } from '../services/teamService';
// import MyModal from '../cmps/custom/MyModal.vue';
export default {
  components: {
    MemberList,
    MyInput,
    // MyModal
  },
  data() {
    return {
      tasks: [...teamService.getWeekData().tasks],
      isAddFormOpen: false,
      newMemberName: '',
    };
  },
  created() {
    this.loadMembers();
  },
  computed: {
    membersToShow() {
      return this.$store.getters.members;
    },
  },
  methods: {
    async loadMembers() {
      await this.$store.dispatch({ type: 'loadMembers' });
    },
    memberTasksUpdate(updatedMember) {
      this.$store.dispatch({ type: 'updateMember', member: updatedMember });
    },
    addMember() {
      this.$store.dispatch({
        type: 'addMember',
        memberName: this.newMemberName,
      });
      this.newMemberName = '';
      this.isAddFormOpen = false;
    },
    removeMember(memberId) {
      this.$store.dispatch({ type: 'removeMember', memberId });
    },
    toggleAddForm({ relatedTarget }) {
      // For preventing the fire of @blur & @click at the same time when the modal is open and clicking the button.
      if (
        relatedTarget?.nodeName === 'BUTTON' ||
        relatedTarget?.nodeName === 'INPUT'
      )
        return;

      this.isAddFormOpen = !this.isAddFormOpen;

      // Focus the form when open it. In need for the @blur event for closing it
      this.isAddFormOpen &&
        this.$nextTick(() => {
          this.$refs.addForm.focus();
        });
    },
  },
};
</script>

<style>
</style>