<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-small-size-100">
        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('first_name')">
                <label for="first-name">First Name</label>
                <md-input
                  name="first-name"
                  id="first-name"
                  autocomplete="given-name"
                  v-model="form.first_name"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.first_name.required"
                  >The first name is required</span
                >
                <span class="md-error" v-else-if="!$v.form.first_name.minlength"
                  >Invalid first name</span
                >
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('last_name')">
                <label for="last-name">Last Name</label>
                <md-input
                  name="last-name"
                  id="last-name"
                  autocomplete="family-name"
                  v-model="form.last_name"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.last_name.required"
                  >The last name is required</span
                >
                <span class="md-error" v-else-if="!$v.form.last_name.minlength"
                  >Invalid last name</span
                >
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('password')">
                <label for="password">Password</label>
                <md-input name="password" id:="password" v-model="form.password"
                type="password" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.password.required"
                  >Password is required</span
                >
                <span class="md-error" v-else-if="!$v.form.password.minlength"
                  >Password at least 6 characters long</span
                >
                <span class="md-error" v-else-if="!$v.form.password.maxLength"
                  >Password can't be longer than 32 characters</span
                >
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field
                :md-toggle-password="false"
                :class="getValidationClass('confirmPassword')"
              >
                <label for="confirmPassword">Confirm Password</label>
                <md-input name="confirmPassword" id:="confirmPassword"
                v-model="form.confirmPassword" type="password"
                :disabled="sending" />
                <span
                  class="md-error"
                  v-if="!$v.form.confirmPassword.sameAsPassword"
                  >Password does not match</span
                >
              </md-field>
            </div>
          </div>

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
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending"
            >Sumbit</md-button
          >
          <md-button class="md-primary" @click="closeDialog">Close</md-button>
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  sameAs,
  maxLength,
} from "vuelidate/lib/validators";

export default {
  name: "FormValidation",
  props: ["submissionStatus"],
  mixins: [validationMixin],
  data: () => ({
    form: {
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      confirmPassword: null,
    },
    sending: false,
  }),
  watch: {
    submissionStatus: function (newStatus) {
      this.sending = false;
      if (newStatus === "success") {
        this.clearForm();
      }
    },
  },
  validations: {
    form: {
      first_name: {
        required,
        minLength: minLength(3),
      },
      last_name: {
        required,
        minLength: minLength(3),
      },
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(32),
      },
      confirmPassword: {
        sameAsPassword: sameAs("password"),
      },
    },
  },
  methods: {
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
      this.form.first_name = null;
      this.form.last_name = null;
      this.form.email = null;
      this.form.password = null;
      this.form.confirmPassword = null;
    },
    saveUser() {
      this.sending = true;
      this.$emit("saveUser", this.form);
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
    },
    submissionStatusCheck(status) {
      this.sending = false;
      if (status === "success") {
        this.clearForm();
      }
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>

<style scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>