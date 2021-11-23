<template>
  <div class="app-header-wrapper main-container">
    <section class="app-header flex align-center space-between">
      <nav class="main-nav flex space-between align-center" :class="{'menu-open': isMobileMenuOpen}">
        <router-link to="/">
          <img class="logo" alt="logo" src="../assets/img/logo.png"
        />
        <template class="home-a" v-if="isMobileMenuOpen">Home</template>
        </router-link>
        <router-link to="/team">Team</router-link>
        <router-link to="/member">Members</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/about">About</router-link>
      </nav>
      <div class="user-title flex align-center" v-if="loggedinUser">
        <h5>
          Hello {{ loggedinUser.username }}!
          {{ loggedinUser.isAdmin ? '(ADMIN)' : '' }}
        </h5>
        <img
          class="avatar"
          :src="require(`../assets/img/${userAvatar}`)"
          alt=""
          @click="toggleUserOptModal"
        />
        <div
          v-if="isUserOptOpen"
          class="user-opt-modal"
          ref="modal"
          tabindex="0"
          @blur="toggleUserOptModal"
        >
          <ul class="user-opt-nav clean-list flex column">
            <li>
              <router-link to="/404" class="flex column align-center"
                >Profile</router-link
              >
            </li>
            <li>
              <router-link to="/404" class="flex column align-center"
                >Things</router-link
              >
            <li v-if="loggedinUser.isAdmin">
              <router-link to="/request" class="flex column align-center"
                >Requests</router-link
              >
            </li>
            <hr />
            <li @click="onLogout">Log Out</li>
          </ul>
        </div>
      </div>
      <router-link class="login-btn" to="/login" v-else> Log In </router-link>
      <div
        class="mobile-menu-btn"
        :class="{ 'menu-open': isMobileMenuOpen}"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        {{ isMobileMenuOpen ? 'X' : '☰' }}
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isUserOptOpen: false,
      isMobileMenuOpen: false,
    };
  },
  created() {
    this.loadLoggedinUser();
  },
  methods: {
    loadLoggedinUser() {
      this.$store.dispatch({ type: 'loadLoggedinUser' });
    },
    async onLogout() {
      this.$store.dispatch({ type: 'logout' });
      this.$router.push('/');
    },
    toggleUserOptModal({ relatedTarget }) {
      // For preventing the fire of @blur when the links inside it clicked. after redirecting close it.
      if (relatedTarget?.nodeName === 'A') {
        setTimeout(() => {
          this.isUserOptOpen = false;
        }, 200);
        return;
      }
      this.isUserOptOpen = !this.isUserOptOpen;

      // Focus the form when open it. In need for the @blur event for closing it
      this.isUserOptOpen &&
        this.$nextTick(() => {
          this.$refs.modal.focus();
        });
    },
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    userAvatar() {
      // return "../assets/img/matan-img.png"
      return this.loggedinUser.imgUrl || 'avatar-placeholder.png';
    },
  },
};
</script>
