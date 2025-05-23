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

const serverRefreshTrigger = ref(0);

const snackbarQueue = ref<{ message: string; color: string }[]>([])
const snackbarMessage = ref('')
const snackbarColor = ref('')
const showSnackbar = ref(false)
let isShowing = false

function handleNotify(message: string, color: string) {
  snackbarQueue.value.push({ message, color })
  if (!isShowing) {
    processSnackbarQueue()
  }
}

function processSnackbarQueue() {
  if (snackbarQueue.value.length === 0) {
    isShowing = false
    return
  }

  const next = snackbarQueue.value.shift()
  if (next) {
    snackbarMessage.value = next.message
    snackbarColor.value = next.color
    showSnackbar.value = true
    isShowing = true

    // Wait for the snackbar to close, then process next
    setTimeout(() => {
      showSnackbar.value = false
      setTimeout(() => processSnackbarQueue(), 300) // short delay before next
    }, 5000) // match your :timeout
  }
}


function handleNodeUpdate() {
  console.log("Triggered handleNodeUpdate")
  serverRefreshTrigger.value++; // triggers re-fetch in ServerList
}
</script>
