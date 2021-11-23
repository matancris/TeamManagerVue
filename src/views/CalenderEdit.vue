<template>
  <section class="calender-edit">
    <!-- <my-transition name="accordion"> -->
    <button @click="toggleEditForm">Update Form</button>
    <!-- <my-modal :isModalOpen="isFormOpen"> -->
    <section
      class="edit-form-wrapper flex align-center justify-center"
      v-if="isFormOpen"
    >
      <form
        class="calender-edit-form flex column align-center space-around"
        @submit.prevent="onSubmit"
        @blur="toggleEditForm"
        tabindex="0"
        ref="editForm"
      >
        <select
          name="member"
          v-model="memberId"
        >
          <option
            v-for="member in members"
            :key="member._id"
            :value="member._id"
          >
            {{ member.name }}
          </option>
        </select>
        <select name="day" v-model="day">
          <option v-for="day in days" :key="day">{{ day }}</option>
        </select>
        <div class="flex column">
          <label for="from-hour">from</label>
          <select name="from-hour" id="from-hour" v-model="fromHour">
            <option v-for="hour in hours" :key="hour">{{ hour }}</option>
          </select>
        </div>
        <div class="flex column">
          <label for="from-hour">to</label>
          <select name="to-hour" v-model="toHour">
            <option v-for="hour in hours" :key="hour">{{ hour }}</option>
          </select>
        </div>
        <select name="task" v-model="task">
          <option v-for="task in tasks" :key="task">{{ task }}</option>
        </select>
        <button>save</button>
      </form>
    </section>

  </section>
</template>

<script>
// import MyModal from '../cmps/custom/MyModal.vue';
// import MyTransition from '../cmps/custom/MyTransition.vue';
export default {
  // components: { MyModal },
  // components: { MyTransition },
  // props: ['members', 'days', 'hours', 'tasks'],
  props: {
    members: Array,
    days: Array,
    hours: Array,
    tasks: Array,
  },
  data() {
    return {
      isFormOpen: false,
      memberId: '',
      day: 'Sunday',
      fromHour: '08:00',
      toHour: '08:00',
      task: 'Queue',
    };
  },
  created() {
    this.memberId = this.members[0]?._id;
  },
  watch: {
    memberId(newMemberId) {
      this.$emit('changeMember', newMemberId);
    },
  },
  methods: {
    onSubmit() {
      this.$emit('updateCalender', this.$data);
      this.isFormOpen = false;
    },
    toggleEditForm({ relatedTarget }) {
      console.log('toggleEditForm ~ relatedTarget', relatedTarget);
      // For preventing the fire of @blur & @click at the same time when the modal is open and clicking the button.
      if (
        relatedTarget?.nodeName === 'BUTTON' ||
        relatedTarget?.nodeName === 'SELECT'
      )
        return;

      this.isFormOpen = !this.isFormOpen;

      // Focus the form when open it. In need for the @blur event for closing it
      this.isFormOpen &&
        this.$nextTick(() => {
          this.$refs.editForm.focus();
        });
    },
  },
};
</script>

<style>
</style>