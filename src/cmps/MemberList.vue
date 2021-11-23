<template>
  <section class="member-list">
    <member-preview
      v-for="member in members"
      :member="member"
      :tasks="tasks"
      :key="member.name"
      @memberTasksUpdate="memberTasksUpdate"
      @removeMember="removeMember"
    />
  </section>
</template>

<script>
import MemberPreview from './MemberPreview.vue';
export default {
  components: { MemberPreview },
  props: ['members', 'tasks'],
  methods: {
    memberTasksUpdate(updatedMember) {
      this.$emit('memberTasksUpdate', updatedMember)
    },
    removeMember(id) {
       this.$emit('removeMember', id)
    }
  }
};
</script>

<style>
</style>