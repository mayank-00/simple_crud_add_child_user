<template>
  <div class="top-bar d-flex justify-between">
    <h1>ThirdEssential</h1>
    <md-button v-if="isLoggedIn" class="color-white fw-800" @click="logout"
      >Logout</md-button
    >
  </div>
</template>

<script>
import Cookies from "js-cookie";
import router from "../router";
import { mapActions } from "vuex";

export default {
  name: "CustomHeader",
  computed: {
    isLoggedIn() {
      return !!this?.$store?.state?.account?.id;
    },
  },
  methods: {
    ...mapActions(["resetStore"]),
    logout() {
      Cookies.remove("token");
      this.resetStore();
      router.push("/");
    },
  },
};
</script>

<style scoped>
.top-bar {
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: #448aff;
  color: white;
  text-align: left;
  padding-left: 48px;
}
</style>