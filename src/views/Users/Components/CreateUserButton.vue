<template>
  <div class="d-flex flex-end">
    <md-dialog :md-active.sync="showDialog">
      <user-form
        @saveUser="createUser"
        :submissionStatus="submitStatus"
        @closeDialog="showDialog = false"
      ></user-form>
    </md-dialog>
    <md-button class="md-raised md-primary" @click="showDialog = true"
      >Create User</md-button
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
import { mapActions, mapState } from "vuex";

import UserForm from "../../../components/UserForm.vue";
import { createChild } from "../../../api";

export default {
  name: "create-user-button",
  data: () => ({
    showDialog: false,
    submitStatus: "",
    isError: false,
    showMessage: false,
    message: "",
  }),
  components: {
    UserForm,
  },
  computed: {
    ...mapState(["users"]),
  },
  methods: {
    ...mapActions(["updateUsersAction"]),
    async createUser(user) {
      try {
        let response = await createChild(user);

        this.submitStatus = "success";
        this.showDialog = false;

        let { id, first_name, last_name, email, parent_id } =
          response.data.data.user;

        let updatedData = [...this.users];

        updatedData.push({ id, first_name, last_name, email, parent_id });

        this.showMessage = true;
        this.message = "User gets successfully created";

        this.resetSnackbar();

        this.updateUsersAction(updatedData);
      } catch (error) {
        this.showMessage = true;
        this.message = "Error, while creating user";

        this.resetSnackbar();
      }
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