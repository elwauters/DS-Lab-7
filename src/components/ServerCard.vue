<template>
  <v-card class="ma-4" elevation="4" color="indigo-lighten-5">
    <v-list-item height="88">
      <template v-slot:title>
        <v-card-title>
          {{ server.name }}
          <span style="" class="font-weight-light text-subtitle-2 text-grey">({{ server.ip}})</span>
        </v-card-title>
      </template>

      <template v-slot:append>
        <v-chip :color="server.online ? 'green' : 'red'" dark>
          {{ server.online ? 'Online' : 'Offline' }}
        </v-chip>
      </template>
    </v-list-item>
    <v-divider>

    </v-divider>
    <v-card-text>
      <div>Number of Nodes: <strong>{{ server.numberOfNodes }}</strong></div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn variant="tonal" :color="'grey'">
        <template v-slot:prepend>
          <v-icon icon="mdi-information" color="info"></v-icon>
        </template>
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
  <NodeMap v-model="showDetails" :nodeMap="nodeMap" />
</template>



<script lang="ts" setup>

import {ref} from "vue";
import {useApiCall} from "@/composables/useApi";

const showDetails = ref(false);
const nodeMap = ref<Record<string, string>>({})

defineProps<{
  server: {
    id: number;
    name: string;
    ip: string;
    online: boolean;
    numberOfNodes: number;
  };
}>();

const emit = defineEmits<{
  (e: 'notify', message: string, color: string): void;
  (e: 'update-node', value: { id: number, online: boolean }): void;
}>();

async function getServerMap(name: string) {
  const apiUrl = `/${name}/namingserver/node/map`;
  const result = await useApiCall(apiUrl, 'get')
  console.log(result)
  if (result.success) {
    emit('notify',`Node map successfully fetched from ${name}!`, 'success')
    showDetails.value = true;
    nodeMap.value = result.data as Record<string, string>
  } else {
    emit('notify', `Failed to fetch node map from ${name}: ${result.error}`, 'error')
  }
}


</script>
