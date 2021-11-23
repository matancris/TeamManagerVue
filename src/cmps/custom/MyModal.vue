<template>
  <transition name="fade">
    <section class="my-modal flex align-center justify-center" v-if="isOpen">
      <div
        class="modal-body flex column align-center space-around"
        @blur="toggleModal"
        tabindex="0"
        ref="modalBody"
      >
        <slot></slot>
      </div>
    </section>
  </transition>
</template>

<script>
export default {
  props: {
    isModalOpen: Boolean,
  },

  data() {
    return {
      isOpen: this.isModalOpen,
    };
  },
  mounted() {
    console.log('this.$refs', this.$refs);
    // this.$nextTick(() => {
    //   console.log('focos!');
    //   this.$refs.modalBody.focus();
    // });
  },
  watch: {
    isModalOpen($event) {
      this.toggleModal($event);
      console.log('this.$refs', this.$refs);
    },
  },
  methods: {
    toggleModal({ relatedTarget }) {
      // For preventing the fire of @blur & @click at the same time when the modal is open and clicking the button.
      if (
        relatedTarget?.nodeName === 'BUTTON' ||
        relatedTarget?.nodeName === 'SELECT' ||
        relatedTarget?.nodeName === 'INPUT' 

      )
        return;

      this.isOpen = !this.isOpen;

      // Focus the form when open it. In need for the @blur event for closing it
      this.isOpen &&
        this.$nextTick(() => {
          this.$refs.modalBody.focus();
        });
    },
  },
};
</script>

<style>
</style>