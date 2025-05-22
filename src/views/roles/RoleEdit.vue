<template>
  <v-alert
    v-model="showSuccess"
    border="start"
    variant="tonal"
    closable
    close-label="Close Alert"
    color="success"
    title="Saved successfully"
  ></v-alert>
  <v-alert
    v-model="showError"
    border="start"
    variant="tonal"
    closable
    close-label="Close Alert"
    color="error"
    :title="errorMessage"
  ></v-alert>
  <div class="pa-5">
    <h2 v-if="action === 'edit'">Edit Role: {{ role.name }}</h2>
    <h2 v-if="action === 'new'">Create Role</h2>
    <v-row no-gutters>
      <v-col
        cols="12"
        md="6">
        <v-text-field
          v-model="role.name"
          :counter="50"
          label="Name"
          required
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="6">
        <v-select
          v-model="role.privileges"
          :items="privileges"
          item-title="name"
          item-value="id"
          label="Privilege"
          return-object
          required
          multiple
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          color="success"
          @click="save"
        >
          Save
        </v-btn>
        <v-btn
          class="ml-2"
          color="secondary"
          to="/roles"
        >
          Back
        </v-btn>
      </v-col>
    </v-row>

  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import config from "../../../config";
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {Role} from "@/models/User";
import {useAuthStore} from "@/stores/AuthStore";

const route = useRoute();
const router = useRouter();

const role = ref<Role>(new Role(0, "",[]));
const privileges = ref<object[]>([]);
const showSuccess = ref<boolean>(false);
const showError = ref<boolean>(false);
const errorMessage = ref<string>("");
const action = ref("edit")
const authStore = useAuthStore();

async function init() {
  if (route.params.id === "new") {
    action.value = "new";
    return;
  }
  await axios.get(config["API_URL"] + "/roles/" + route.params.id, {headers: authStore.authHeader()})
    .then((response) => {
      role.value = response.data;
    }).catch((error) => {
      showError.value = true;
      errorMessage.value = error.response.data.message;
    })
}
init(); // call init() on component load

async function initPrivilegeOptions() {
  await axios.get(config["API_URL"] + "/privileges", {headers: authStore.authHeader()})
    .then((response) => {
      privileges.value = response.data;
    }).catch((error) => {
      showError.value = true;
      errorMessage.value = error.response.data.message;
    })
}
initPrivilegeOptions(); // call initRoleOptions() on component load


async function save() {
  if (action.value === "new") {
    await axios.put(config["API_URL"] + "/roles/new", role.value, {headers: authStore.authHeader()})
      .then(async () => {
        showSuccess.value = true;
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push("/roles")
      })
      .catch((error) => {
        showError.value = true;
        if(error.response.data.message) {
          errorMessage.value = error.response.data.message;
        } else if (typeof error.response.data === "object") {
          errorMessage.value = "Something went wrong.";
        }
      })
  } else {
    await axios.post(config["API_URL"] + "/roles/" + route.params.id, role.value, {headers: authStore.authHeader()})
      .then(async () => {
        showSuccess.value = true;
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push("/roles")
      })
      .catch((error) => {
        showError.value = true;
        if(error.response.data.message) {
          errorMessage.value = error.response.data.message;
        } else if (typeof error.response.data === "object") {
          errorMessage.value = "Something went wrong.";
        }
      })
  }
}


</script>

<style scoped>

</style>
