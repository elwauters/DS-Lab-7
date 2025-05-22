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
          @notify="$emit('notify', $event)"
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

const emit = defineEmits<{
  (e: 'notify', message: string, color: string): void
}>()

const servers = ref<NamingServer[]>([
  new NamingServer(1, 'g2c1', false, 0, 'http://172.19.0.1:8083'),
])

async function fetchNodeCounts() {
  for (const server of servers.value) {
    const result = await useApiCall(`${servers.value[0].ip}/namingserver/node/count`, 'get')
    if (result.success) {
      server.numberOfNodes = result.data
    } else {
      emit('notify', `Failed to fetch number of nodes for ${servers.value[0].name}: ${result.error}`, 'error')
    }
  }
}

onMounted(() => {
  fetchNodeCounts()
})
</script>
