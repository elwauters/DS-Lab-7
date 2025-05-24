<template>
  <v-dialog v-model="show" max-width="700">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        File Details
      </v-card-title>

      <v-divider />

      <v-card-text v-if="ownedFiles.length === 0 && replicatedFiles.length === 0">
        No files associated with this node.
      </v-card-text>

      <v-card-text v-else>
        <div v-if="ownedFiles.length > 0">
          <h3 class="text-subtitle-1 font-weight-bold mb-2">Files Owned by This Node</h3>
          <v-list dense>
            <v-list-item v-for="file in ownedFiles" :key="file.filename">
              <template v-slot:prepend>
                <v-icon icon="mdi-file"></v-icon>
              </template>
              <v-list-item-title>{{ file.filename }} ({{file.fileHash}})</v-list-item-title>
              <v-list-item-subtitle>Version: {{ file.version }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn
                  v-if="!file.locked"
                  color="grey-lighten-1"
                  icon="mdi-lock-open-variant"
                  variant="text"
                  @click="requestLock(file.fileName)"
                ></v-btn>
                <v-btn
                  v-if="file.locked"
                  icon="mdi-lock"
                  variant="text"
                  @click="releaseLock(file.fileName)"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </div>

        <v-divider class="my-4" v-if="ownedFiles.length > 0 && replicatedFiles.length > 0" />

        <div v-if="replicatedFiles.length > 0">
          <h3 class="text-subtitle-1 font-weight-bold mb-2">Replicated Files</h3>
          <v-list dense>
            <v-list-item v-for="file in replicatedFiles" :key="file.filename">
              <template v-slot:prepend>
                <v-icon icon="mdi-file-multiple"></v-icon>
              </template>
              <v-list-item-title>{{ file.filename }} ({{file.fileHash}})</v-list-item-title>
              <v-list-item-subtitle>Version: {{ file.version }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="emit('update:modelValue', false)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { FileInfo } from "@/models/FileInfo";
import {useApiCall} from "@/composables/useApi";
import {fi} from "vuetify/locale";

const props = defineProps<{
  modelValue: boolean
  fileMap: Record<string, FileInfo>
  nodeIp: string
  nodeName: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'notify', message: string, color: string): void;
  (e: 'reload-map'):void;
}>();

const show = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  show.value = val
})

watch(show, (val) => {
  emit('update:modelValue', val)
})

// Computed categorized lists
const ownedFiles = computed(() =>
  Object.values(props.fileMap).filter(
    (file) => file.owner === props.nodeIp
  )
)

const replicatedFiles = computed(() =>
  Object.values(props.fileMap).filter(
    (file) =>
      file.owner !== props.nodeIp &&
      file.replicationLocations?.includes(props.nodeIp)
  )
)

async function requestLock(fileName: string) {
  const apiUrl = `/${props.nodeName}/agent/sync/lock/${fileName}`;
  const result = await useApiCall(apiUrl, 'post')
  if (result.success) {
    emit('notify',`Lock for ${fileName} requested successfully!`, 'success')
    emit('reload-map')
  } else {
    emit('notify', `Failed to requests lock for ${fileName}: ${result.error}`, 'error')
  }
}

async function releaseLock(fileName: string) {
  const apiUrl = `/${props.nodeName}/agent/sync/unlock/${fileName}`;
  const result = await useApiCall(apiUrl, 'post')
  if (result.success) {
    emit('notify',`Lock for ${fileName} successfully released!`, 'success')
    emit('reload-map')
  } else {
    emit('notify', `Failed to release lock for ${fileName}: ${result.error}`, 'error')
  }
}
</script>

<style scoped>
.v-card-text {
  max-height: 400px;
  overflow-y: auto;
}
</style>
