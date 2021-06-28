<template>
  <md-dialog :md-active.sync="show">
    <md-card>
      <md-card-content class="text-16 pt-10">
        Are you sure, you want to delete
        {{ `${user.first_name} ${user.last_name}` }} user?
      </md-card-content>
      <md-card-actions>
        <md-button @click="deleteClicked" class="md-accent">Delete</md-button>
        <md-button @click="cancelClicked" class="md-primary">Cancel</md-button>
      </md-card-actions>
    </md-card>
  </md-dialog>
</template>

<script>
export default {
  name: "DeleteModal",
  props: ["show", "user"],
  methods: {
    deleteClicked() {
      this.$emit("deleteClicked");
    },
    cancelClicked() {
      this.$emit("cancelClicked");
    },
  },
};
</script>