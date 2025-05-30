<template>
  <v-container>
    <v-row>
      <v-col
        v-for="server in servers"
        :key="server.id"
        cols="12"
        md="6"
        lg="4"
      >
        <ServerCard :server="server"
          @notify="(message:string, color:string) => $emit('notify', message, color)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import ServerCard from './ServerCard.vue'
import { NamingServer } from '@/models/NamingServer'
import { useApiCall } from '@/composables/useApi'
import { ref, onMounted } from 'vue'
import { watch } from 'vue';

const props = defineProps<{
  refreshTrigger: number;
}>();

const emit = defineEmits<{
  (e: 'notify', message: string, color: string): void
}>()

const servers = ref<NamingServer[]>([
  new NamingServer(1, 'g2c1', false, 0, '172.19.0.6'),
])

async function fetchNodeCounts() {
  for (const server of servers.value) {
    const apiUrl = `/${server.name}/namingserver/node/count`;
    const result = await useApiCall(apiUrl, 'get')
    if (result.success) {
      server.numberOfNodes = result.data
      server.online = true;
    } else {
      server.numberOfNodes = 0;
      // Bad practice
      if (result.error.includes("empty")) {
        server.online = true;
        emit('notify', `Number of nodes fetched, but server ${server.name} currently has no nodes in its map`, 'info');
      } else {
        emit('notify', `Failed to fetch number of nodes for ${server.name}: ${result.error}`, 'error');
      }
    }
  }
}

watch(() => props.refreshTrigger, () => {
  fetchNodeCounts();
});


onMounted(() => {
  fetchNodeCounts()
})
</script>
