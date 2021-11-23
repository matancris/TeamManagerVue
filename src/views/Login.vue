<template>
  <section class="login flex justify-center align-center">
    <form
      class="login-form flex column space-around align-center"
      @submit.prevent="onLogin"
    >
      <h2>Login</h2>
      <my-input
        type="text"
        id="name"
        :isAutoFocus="true"
        v-model="login.username"
        label="Username"
      />
      <my-input
        type="password"
        name="password"
        id="password"
        v-model="login.password"
        label="Password"
      />
      <button type="submit">Log in</button>
    </form>
  </section>
</template>

<script>
import MyInput from '../cmps/custom/MyInput.vue';
export default {
  components: { MyInput },
  //   name: "App",
  data() {
    return {
      login: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    async onLogin() {
      await this.$store.dispatch({ type: 'setLoggedinUser', user: this.login });
      this.$router.push('/team');
    },
  },
};
</script>

