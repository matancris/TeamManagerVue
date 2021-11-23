<template>
  <section class="loader">
    <img class="logo" ref="logo" alt="logo" src="../assets/img/logo.png" />
  </section>
</template>

<script>
export default {
  data() {
    return {
      intervalId: '',
    };
  },
  mounted() {
    let deg = 10;
    this.intervalId = setInterval(() => {
      this.$refs.logo.style.transform = `rotate(${(deg += 10)}deg)`;
    }, 100);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
};
</script>