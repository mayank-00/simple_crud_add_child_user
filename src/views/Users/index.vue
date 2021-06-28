<template>
  <div>
    <custom-header></custom-header>
    <div class="users-container">
      <create-user-button></create-user-button>
      <div class="user-table">
        <user-table></user-table>
      </div>
    </div>
  </div>
</template>

<script>
import UserTable from "./Components/UserTable.vue";
import CreateUserButton from "./Components/CreateUserButton.vue";
import CustomHeader from "../../components/CustomHeader.vue";

import Cookies from "js-cookie";
import { mapActions } from "vuex";

import { getOwnData } from "../../api";
import router from "../../router";

export default {
  name: "Users",
  data: () => ({
    showDialog: false,
    submitStatus: "",
  }),
  components: {
    UserTable,
    CreateUserButton,
    CustomHeader,
  },
  methods: {
    ...mapActions(["setAccountData"]),
  },
  async created() {
    try {
      let response = await getOwnData();

      if (response.data.data === null) {
        Cookies.remove("token");
        router.push("/");
        return;
      }

      this.setAccountData(response.data.data.user);
    } catch (error) {
      Cookies.remove("token");
      router.push("/");
    }
  },
};
</script>

<style scoped>
.users-container {
  padding: 60px 120px;
}
.user-table {
  margin-top: 40px;
  /* max-width: 768px; */
}
</style>