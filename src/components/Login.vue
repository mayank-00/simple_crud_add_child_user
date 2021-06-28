<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <form novalidate class="md-layout" @submit.prevent="validateUser">
        <md-card class="md-layout-item md-small-size-100">
          <md-card-content>
            <md-field :class="getValidationClass('email')">
              <label for="email">Email</label>
              <md-input
                type="email"
                name="email"
                id="email"
                autocomplete="email"
                v-model="form.email"
                :disabled="sending"
              />
              <span class="md-error" v-if="!$v.form.email.required"
                >The email is required</span
              >
              <span class="md-error" v-else-if="!$v.form.email.email"
                >Invalid email</span
              >
            </md-field>

            <md-field :class="getValidationClass('password')">
              <label for="password">Password</label>
              <md-input name="password" id:="password" v-model="form.password"
              type="password" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.password.required"
                >Password is required</span
              >
              <span class="md-error" v-else-if="!$v.form.password.minlength"
                >Password is too short</span
              >
            </md-field>
          </md-card-content>

          <md-progress-bar md-mode="indeterminate" v-if="sending" />

          <md-card-actions>
            <md-button type="submit" class="md-primary" :disabled="sending"
              >Submit</md-button
            >
            <md-button class="md-primary" @click="showDialog = false"
              >Close</md-button
            >
          </md-card-actions>
        </md-card>
      </form>
    </md-dialog>

    <md-button class="md-primary" @click="showDialog = true">Login</md-button>

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
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";

import { mapActions } from "vuex";
import Cookies from "js-cookie";

import { login as loginAPI } from "../api/index";

import router from "../router";

export default {
  name: "Login",
  mixins: [validationMixin],
  data: () => ({
    form: {
      email: null,
      password: null,
    },
    sending: false,
    showDialog: false,
    loginError: false,
    errorMessage: "",
    showMessage: false,
    message: false,
  }),
  validations: {
    form: {
      password: {
        required,
        minLength: minLength(6),
      },
      email: {
        required,
        email,
      },
    },
  },
  methods: {
    ...mapActions(["setAccountData"]),
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.password = null;
      this.form.email = null;
    },
    async login() {
      this.sending = true;

      try {
        const response = await loginAPI(this.form);

        this.sending = false;

        if (response.data.data === null) {
          this.message = response.data.meta.error;
          this.showMessage = true;
          return;
        }
        this.clearForm();
        this.showDialog = false;

        Cookies.set("token", response?.data?.data?.token, { expires: 60 });

        this.setAccountData(response?.data?.data?.user);

        router.push("/users");
      } catch (error) {
        this.sending = false;
        this.message = "Login Failed";
        this.showMessage = true;
      } finally {
        setTimeout(() => {
          this.showMessage = false;
          this.message = "";
        }, 3000);
      }
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.login();
      }
    },
  },
};
</script>
