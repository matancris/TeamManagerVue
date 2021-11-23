<template>
  <div class="my-transition" :class="[name, theme]">
    <div class="header" @click="toggle">
      <slot name="header"></slot>
    </div>
    <transition
      :name="name"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div class="body" v-show="show">
        <div class="body-inner">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    theme: String,
  },
  data() {
    return {
      show: false,
    };
  },

  methods: {
    toggle() {
      this.show = !this.show;
    },
    // enter: function(el, done) {
    //   $(el).slideDown(150, done);
    // },
    // leave: function(el, done) {
    //   $(el).slideUp(150, done);
    // },
    beforeEnter: function (el) {
      el.style.height = '0';
    },
    enter: function (el) {
      el.style.height = el.scrollHeight + 'px';
    },
    beforeLeave: function (el) {
      el.style.height = el.scrollHeight + 'px';
    },
    leave: function (el) {
      el.style.height = '0';
    },
  },
};
</script>

<style>
</style>