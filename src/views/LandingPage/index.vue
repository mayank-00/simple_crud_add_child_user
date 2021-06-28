<template>
  <div class="landing-page">
    <custom-header></custom-header>
    <div class="d-flex align-center justify-center h-80">
      <div class="register-block d-flex align-center justify-center w-50 h-50">
        <register></register>
      </div>
      <div class="login-block d-flex align-center justify-center w-50 h-50">
        <login></login>
      </div>
    </div>
  </div>
</template>

<script>
import Register from "../../components/Register.vue";
import Login from "../../components/Login.vue";
import CustomHeader from "../../components/CustomHeader.vue";

export default {
  name: "LandingPage",
  components: {
    Register,
    Login,
    CustomHeader,
  },
};
</script>

<style>
.landing-page {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: white;
  height: 100vh;
  /* margin-top: 60px; */
}
.button-holder {
  height: 80%;
}
.register-block {
  border-right: 1px solid #448aff;
}
.login-block {
  border-left: 1px solid #448aff;
}
</style>
