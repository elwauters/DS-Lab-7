<script setup lang="ts">
import { ref } from "vue";
import { Role } from "@/models/User";
import axios from "axios";
import config from "../../../config";
import {useAuthStore} from "@/stores/AuthStore";

const roles = ref<Array<Role>>([]);
const deleteDialog = ref<boolean>(false);
const authStore = useAuthStore();


async function initData() {
    const res = await axios.get(config["API_URL"] + "/roles", {headers: authStore.authHeader()});
    if(res && res.data) {
      roles.value = res.data;
    } else {
      roles.value = [];
      console.log("No data returned from API: " + res.status)
    }
}
initData();

function deleteRole(id: number | undefined) {
  if(!id) {
    return;
  }
  axios.delete(config["API_URL"] + "/roles/" + id, {headers: authStore.authHeader()})
    .then(() => {
      initData();
      deleteDialog.value = false;
    })
    .catch((err) => {
      console.log(err);
    });
}

</script>

<template>
  <div class="pa-5">
    <div class="d-flex justify-space-between">
      <h2>Roles</h2>
      <v-btn
        color="primary"
        :to="'/roles/new'"
      > Add new role
      </v-btn>
    </div>
  </div>

  <p>Here is a list of our different roles:</p>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">
          Id
        </th>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          Privileges
        </th>
        <th class="text-left">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="role in roles"
        :key="role.id"
      >
        <td>{{ role.id }}</td>
        <td>{{ role.name }}</td>
        <td>
          <v-chip
            v-for="privilege in role.privileges"
            :key="privilege.id"
            color="primary"
            small
          >
            {{ privilege.name }}
          </v-chip>
        </td>
        <td>
          <v-btn
            color="primary"
            icon="mdi-pencil"
            size="x-small"
            :to="'/roles/' + role.id"
          >
          </v-btn>
          <v-btn
            class="ml-1 ml-xs-0"
            color="error"
            icon="mdi-delete"
            size="x-small"
            @click="deleteDialog = true; deleteRoleId = role.id"
          >
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>


  <v-dialog
    v-model="deleteDialog"
    max-width="300"
  >
    <v-card>
      <v-card-text>
        Are you sure you want to delete this role?
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="deleteRole(deleteRoleId)">Confirm</v-btn>
        <v-btn color="secondary" @click="deleteDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
