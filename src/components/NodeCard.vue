<template>
  <v-card class="ma-4" elevation="4" color="grey-lighten-4">
    <v-list-item height="88">
      <template v-slot:title>
        <v-card-title>
          {{ node.name }}
          <span style="" class="font-weight-light text-subtitle-2 text-grey">({{ node.ip}})</span>
        </v-card-title>
      </template>

      <template v-slot:append>
        <v-chip :color="node.online ? 'green' : 'red'" dark>
          {{ node.online ? 'Online' : 'Offline' }}
        </v-chip>
      </template>
    </v-list-item>
    <v-divider></v-divider>
    <v-card-text>
      <div>
        Previous node <strong>{{ node.previousId }}</strong>
      </div>
      <div>
        Next node <strong>{{ node.nextId }}</strong>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn variant="tonal" :color="'grey'"
        @click="pingNode(node.name)"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-pulse" color="info"></v-icon>
        </template>
        Ping
      </v-btn>
      <v-btn variant="tonal" :color="'grey'"
        @click="startNode(node.name, node.id)">
        <template v-slot:prepend>
          <v-icon icon="mdi-power" color="success"></v-icon>
        </template>
        Start
      </v-btn>
      <v-btn variant="tonal" :color="'grey'"
        @click="stopNode(node.name, node.id)">
        <template v-slot:prepend>
          <v-icon icon="mdi-power" color="error"></v-icon>
        </template>
        Shutdown
      </v-btn>
      <v-btn variant="tonal" :color="'grey'">
        <template v-slot:prepend>
          <v-icon icon="mdi-information" color="info"></v-icon>
        </template>
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import {useApiCall} from "@/composables/useApi";

defineProps<{
  node: {
    id: number;
    name: string;
    online: boolean;
    ip: string;
    nextId: string;
    previousId: string;
  };
}>();

const emit = defineEmits<{
  (e: 'notify', message: string, color: string): void;
  (e: 'update-node', value: { id: number, online: boolean }): void;
  (e: 'update-np'): void
}>();


async function pingNode(name: string) {
  const apiUrl = `/${name}/node/ping`;
  const result = await useApiCall(apiUrl, 'get')
  if (result.success) {
    emit('notify',`Node ${name} pinged successfully!`, 'success')
  } else {
    emit('notify', `Failed to ping node ${name}: ${result.error}`, 'error')
  }
}

async function startNode(name: string, id: number) {
  const apiUrl = `/${name}/node/start`;
  const result = await useApiCall(apiUrl, 'post')
  if (result.success) {
    emit('notify',`Node ${name} started successfully!`, 'success')
    emit('update-node', { id: id, online: true });
    emit('update-np')
  } else {
    emit('notify', `Failed to start node ${name}: ${result.error}`, 'error')
  }
}

async function stopNode(name: string, id: number) {
  const apiUrl = `/${name}/node/shutdown`;
  const result = await useApiCall(apiUrl, 'delete')
  if (result.success) {
    emit('notify',`Node ${name} stopped successfully!`, 'success')
    emit('update-node', { id: id, online: false });
    emit('update-np')
  } else {
    emit('notify', `Failed to stop node ${name}: ${result.error}`, 'error')
  }
}
</script>
