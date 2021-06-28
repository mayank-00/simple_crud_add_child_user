<template>
  <div>
    <md-table v-model="searched" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Users</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input
            placeholder="Search"
            v-model="search"
            @input="searchOnTable"
          />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No users found"
        :md-description="`No user found for this '${search}' query. Try a different search term.`"
      >
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{
          item.id
        }}</md-table-cell>
        <md-table-cell md-label="First Name" md-sort-by="name">{{
          item.first_name
        }}</md-table-cell>
        <md-table-cell md-label="Last Name" md-sort-by="email">{{
          item.last_name
        }}</md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="gender">{{
          item.email
        }}</md-table-cell>
        <md-table-cell md-label="Actions" md-sort-by="title">
          <table-action-column
            @showSnackbar="showSnackbarHandler"
            :item="item"
            :account="account"
          ></table-action-column>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-snackbar
      md-position="center"
      :md-duration="3000"
      :md-active.sync="showSnackbar"
      md-persistent
    >
      <span>{{ message }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getAllUsers } from "../../../api";

import TableActionColumn from "./TableActionColumn.vue";

const toLower = (text) => {
  return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
  if (term) {
    term = toLower(term);
    return items.filter(
      (item) =>
        toLower(item.first_name).includes(term) ||
        toLower(item.last_name).includes(term) ||
        toLower(item.email).includes(term)
    );
  }

  return items;
};

export default {
  name: "UserTable",
  data: () => ({
    search: "",
    searched: [],
    isUsersFetching: false,
    isFetchingError: false,
    showSnackbar: false,
    message: "",
  }),
  components: {
    TableActionColumn,
  },
  methods: {
    ...mapActions(["updateUsersAction"]),
    newUser() {
      window.alert("Noop");
    },
    searchOnTable() {
      this.searched = searchByName(this.users, this.search);
    },
    showSnackbarHandler(message) {
      this.showSnackbar = true;
      this.message = message;

      setTimeout(() => {
        this.showSnackbar = false;
        this.message = "";
      }, 3000);
    },
  },
  computed: {
    ...mapState(["users", "account"]),
  },
  watch: {
    users: function (newUsers) {
      process.nextTick(() => {
        if (this.search) {
          this.searched = searchByName(newUsers, this.search);
        } else {
          this.searched = newUsers;
        }
      });
    },
  },
  async created() {
    try {
      this.isUsersFetching = true;
      let response = await getAllUsers();

      this.updateUsersAction(response.data.data.users);
      this.isUsersFetching = false;
    } catch (error) {
      this.isUsersFetching = false;
      this.isFetchingError = true;
    }
  },
};
</script>

<style scoped>
.md-field {
  max-width: 300px;
}
</style>