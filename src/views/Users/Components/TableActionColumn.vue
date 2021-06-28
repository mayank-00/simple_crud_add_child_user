<template>
  <div v-if="item.parent_id === account.id">
    <md-button class="md-accent" @click="deleteIconClicked">
      Delete
      <!-- <md-icon class="fa fa-trash cursor-pointer"></md-icon> -->
    </md-button>

    <md-button class="md-primary" @click="editModal.show = true">
      Edit
      <!-- <md-icon class="fa fa-edit cursor-pointer"></md-icon> -->
    </md-button>

    <!-- delete modal -->
    <delete-modal
      :show="deleteModal.show"
      :user="item"
      @deleteClicked="deleteConfirmed"
      @cancelClicked="deleteModal.show = false"
    ></delete-modal>
    <!-- edit modal -->
    <md-dialog :md-active.sync="editModal.show">
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
                    v-model="editModal.form.first_name"
                    :disabled="editModal.sending"
                  />
                  <span
                    class="md-error"
                    v-if="!$v.editModal.form.first_name.required"
                    >The first name is required</span
                  >
                  <span
                    class="md-error"
                    v-else-if="!$v.editModal.form.first_name.minlength"
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
                    v-model="editModal.form.last_name"
                    :disabled="editModal.sending"
                  />
                  <span
                    class="md-error"
                    v-if="!$v.editModal.form.last_name.required"
                    >The last name is required</span
                  >
                  <span
                    class="md-error"
                    v-else-if="!$v.editModal.form.last_name.minlength"
                    >Invalid last name</span
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
                v-model="editModal.form.email"
                :disabled="editModal.sending"
              />
              <span class="md-error" v-if="!$v.editModal.form.email.required"
                >The email is required</span
              >
              <span class="md-error" v-else-if="!$v.editModal.form.email.email"
                >Invalid email</span
              >
            </md-field>
          </md-card-content>

          <md-progress-bar md-mode="indeterminate" v-if="editModal.sending" />

          <md-card-actions>
            <md-button
              type="submit"
              class="md-primary"
              :disabled="editModal.sending"
              >Save</md-button
            >
            <md-button class="md-primary" @click="editModal.show = false"
              >Close</md-button
            >
          </md-card-actions>
        </md-card>
      </form>
    </md-dialog>
  </div>
</template>

<script>
import { deleteChild as deleteChildAPI, patchChild } from "../../../api";

import DeleteModal from "../../../components/DeleteModal.vue";

import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";

import { mapActions } from "vuex";

export default {
  components: { DeleteModal },
  name: "TableActionColumn",
  props: ["item", "account"],
  mixins: [validationMixin],
  data: () => ({
    deleteModal: {
      show: false,
      sending: false,
    },
    editModal: {
      show: false,
      form: {
        first_name: null,
        last_name: null,
        email: null,
      },
      sending: false,
    },
  }),
  validations: {
    editModal: {
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
      },
    },
  },
  methods: {
    ...mapActions(["deleteASingleUserAction", "updateASingleUserAction"]),
    getValidationClass(fieldName) {
      const field = this.$v.editModal.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    async deleteConfirmed() {
      try {
        this.deleteModal.sending = true;

        await deleteChildAPI(this.item.id);

        this.deleteModal.sending = false;
        this.$emit("showSnackbar", "User deleted successfully");
        this.deleteASingleUserAction(this.item.id);
      } catch (error) {
        this.$emit("showSnackbar", "Error while deleting user");
        this.deleteModal.sending = false;
      }
    },
    async editUser() {
      try {
        this.editModal.sending = true;

        let updatedUser = {
          id: this.item.id,
          first_name: this.editModal.form.first_name,
          last_name: this.editModal.form.last_name,
          email: this.editModal.form.email,
        };

        await patchChild(updatedUser);

        this.editModal.sending = false;
        this.$emit("showSnackbar", "User edited successfully");

        updatedUser.parent_id = this.item.parent_id;
        this.updateASingleUserAction(updatedUser);

        this.editModal.show = false;
      } catch (error) {
        this.$emit("showSnackbar", "Error, while editing user");
        this.editModal.sending = false;
      }
    },
    deleteIconClicked() {
      this.deleteModal.show = true;
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.editUser();
      }
    },
  },
  watch: {
    item: function (newItem) {
      this.editModal.form.id = newItem.id;
      this.editModal.form.last_name = newItem.last_name;
      this.editModal.form.first_name = newItem.first_name;
      this.editModal.form.email = newItem.email;
    },
  },
  created() {
    this.editModal.form.id = this.item.id;
    this.editModal.form.last_name = this.item.last_name;
    this.editModal.form.first_name = this.item.first_name;
    this.editModal.form.email = this.item.email;
  },
};
</script>