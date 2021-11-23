<template>
  <section class="member-preview card flex column">
    <h3>{{ member.name }}</h3>
    <div class="flex space-between" v-for="task in tasks" :key="task">
      <label :for="`task-checkbox-${member.name + task}`">{{ task }}</label>
      <input
        type="checkbox"
        name=""
        :id="`task-checkbox-${member.name + task}`"
        :checked="checkIsInMemberTasks(task)"
        v-model="newTasks"
        :value="task"
      />
    </div>
    <button class="delete-btn" @click="onRemoveMember(member._id)">Delete</button>
  </section>
</template>

<script>
export default {
  props: ['member', 'tasks'],
  data() {
    return {
      newTasks: [...this.member.tasks],
    };
  },
  watch: {
    newTasks(newTasks)  {
      const updatedMember = JSON.parse(JSON.stringify(this.member))
      updatedMember.tasks = newTasks
      this.$emit('memberTasksUpdate', updatedMember);
    },
  },
  methods: {
    checkIsInMemberTasks(task) {
      return this.member.tasks.includes(task)
    },
    onRemoveMember(id) {
      if(confirm('Are you sure?')) this.$emit('removeMember', id);
    }
  },
};
</script>

<style>
</style>