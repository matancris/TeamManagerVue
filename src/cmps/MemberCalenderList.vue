<template>
  <section class="member-calender-list flex column" >
    <draggable
      v-bind="dragOptions"
      @start="isDragging = true"
      @end="isDragging = false"
      handle=".handle-dnd"
    >
      <transition-group type="transition" name="flip-list">
        <member-calender-preview
          v-for="member in members"
          :key="member._id"
          :member="member"
          :days="days"
          :hours="hours"
          @updateMember="updateMember"
        />
      </transition-group>
    </draggable>
  </section>
</template>

<script>
import MemberCalenderPreview from './MemberCalenderPreview.vue';
import draggable from 'vuedraggable';

export default {
  props: ['members', 'days', 'hours'],
  components: {
    MemberCalenderPreview,
    draggable,
  },
  data() {
    return {
      isDragging: false,
    };
  },
  methods: {
    updateMember(member) {
      this.$emit('updateMember', member);
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
  },
};
</script>

<style>
</style>