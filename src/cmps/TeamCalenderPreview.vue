<template>
  <article class="team-calender-preview calender-preview">
    <my-transition name="accordion" >
      <h1 slot="header">Main Calender</h1>
      <week-table :isCalenderOpen="isCalenderOpen">
        <tr :key="hour" v-for="hour in hours">
          <th>{{ hour }}</th>
          <td v-for="day in days" :key="day">
            <p
              v-for="(value, task) in taskNumMap[day][hour]"
              :class="{ green: value.members.length >= 5 && task === 'Queue' }"
              :key="task"
              :title="value.members"
            >
              {{ task + ': ' + value.members.length }}
            </p>
          </td>
        </tr>
      </week-table>
    </my-transition>
  </article>
</template>

<script>
import MyTransition from './custom/MyTransition.vue';
import WeekTable from './WeekTable.vue';
export default {
  components: { WeekTable, MyTransition },
  props: ['taskNumMap', 'days', 'hours'],
  data() {
    return {
      isCalenderOpen: true,
    };
  },
  methods: {
    toggleCalenderOpen() {
      this.isCalenderOpen = !this.isCalenderOpen;
    },
  },
  computed: {},
};

// <table v-if="isCalenderOpen">
//       <thead>
//         <tr>
//           <th></th>
//           <th v-for="day in days" :key="day">{{ day }}</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr :key="hour" v-for="hour in hours">
//           <th>{{ hour }}</th>
// </tr>
//       </tbody>
//     </table>
</script>

<style>
</style>