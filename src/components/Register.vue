<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <user-form
        @saveUser="register"
        :submissionStatus="submitStatus"
        @closeDialog="showDialog = false"
      ></user-form>
    </md-dialog>

    <md-button class="md-primary" @click="showDialog = true"
      >Register</md-button
    >

    <md-snackbar
      md-position="center"
      :md-duration="3000"
      :md-active.sync="showMessage"
      md-persistent
    >
      <span>{{ message }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import UserForm from "./UserForm.vue";
import { register as registerAPI } from "../api/index";

export default {
  name: "Register",
  components: {
    UserForm,
  },
  data: () => ({
    showDialog: false,
    submitStatus: "",
    showMessage: false,
    message: "",
  }),
  methods: {
    register(user) {
      registerAPI(user)
        .then((response) => {
          if (response.data?.meta?.error) {
            this.showMessage = true;
            this.submitStatus = "failed";
            this.message = response.data.meta.error;
            this.resetSnackbar();
            return;
          }

          this.submitStatus = "success";
          this.showDialog = false;

          this.showMessage = true;
          this.message = "Registration Completed";
          this.resetSnackbar();
        })
        .catch(() => {
          this.showMessage = true;
          this.submitStatus = "failed";
          this.message = "Registration Failed";
          this.resetSnackbar();
        });
    },
    resetSnackbar() {
      setTimeout(() => {
        this.showMessage = false;
        this.message = "";
      }, 3000);
    },
  },
};
</script>