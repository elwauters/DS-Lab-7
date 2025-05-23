<template>
  <v-container>
    <v-container>
      <div class="text-h5 font-weight-bold" style="margin-left: 2%">Servers</div>
      <ServerList
        @notify="handleNotify"
        :refresh-trigger="serverRefreshTrigger"
      />
    </v-container>
    <v-divider style="margin-left: 2.5%; margin-right: 2.5%"/>
    <v-container>
      <div class="text-h5 font-weight-bold" style="margin-left: 2%">Nodes</div>
      <NodeList
        @notify="handleNotify"
        @node-changed="handleNodeUpdate"
      />
    </v-container>
    <v-snackbar v-model="showSnackbar" :timeout="5000" :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import NodeList from "@/components/NodeList.vue";
import ServerList from "@/components/ServerList.vue";

import { ref } from 'vue'

const snackbarMessage = ref('')
const showSnackbar = ref(false)
const snackbarColor = ref('')
const serverRefreshTrigger = ref(0);

function handleNotify(message: string, color: string) {
  snackbarMessage.value = message
  showSnackbar.value = true
  snackbarColor.value = color;
}

function handleNodeUpdate() {
  console.log("Triggered handleNodeUpdate")
  serverRefreshTrigger.value++; // triggers re-fetch in ServerList
}
</script>
