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
                  @click="requestLock(file.filename)"
                ></v-btn>
                <v-btn
                  v-if="file.locked"
                  icon="mdi-lock"
                  variant="text"
                  @click="releaseLock(file.filename)"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </div>
        <div class="mt-4 d-flex align-center" style="width: 100%;">
          <v-file-input
            v-model="selectedFile"
            label="Upload a file"
            prepend-icon="mdi-upload"
            accept="*/*"
            :multiple="false"
            dense
            outlined
            hide-details
            class="flex-grow-1 mr-2"
          ></v-file-input>
          <v-btn
            variant="text"
            :disabled="!selectedFile || selectedFile.length === 0"
            @click="uploadFile"
            height="40"
          >
            Upload
          </v-btn>
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
              <template v-slot:append>
                <v-btn
                  v-if="!file.locked"
                  color="grey-lighten-1"
                  icon="mdi-lock-open-variant"
                  variant="text"
                  disabled
                ></v-btn>
                <v-btn
                  v-if="file.locked"
                  color="grey-lighten-1"
                  icon="mdi-lock"
                  variant="text"
                  disabled
                ></v-btn>
              </template>
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

const props = defineProps<{
  modelValue: boolean
  fileMap: Record<string, FileInfo>
  nodeIp: string
  nodeName: string
}>()

console.log(props.fileMap);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'notify', message: string, color: string): void;
  (e: 'reload-map', nodeName: string): void;
}>();

const show = ref(props.modelValue)

const selectedFile = ref<File[] | null>(null)


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

async function requestLock(filename: string) {
  const apiUrl = `/${props.nodeName}/agent/sync/lock/${filename}?requesterNodeIp=${encodeURIComponent(props.nodeIp)}`;
  const result = await useApiCall(apiUrl, 'post')
  if (result.success) {
    emit('notify',`Lock for ${filename} requested successfully!`, 'success')
    emit('reload-map', props.nodeName)
  } else {
    emit('notify', `Failed to requests lock for ${filename}: ${result.error}`, 'error')
  }
}

async function releaseLock(filename: string) {
  const apiUrl = `/${props.nodeName}/agent/sync/unlock/${filename}?requesterNodeIp=${encodeURIComponent(props.nodeIp)}`;
  const result = await useApiCall(apiUrl, 'post')
  if (result.success) {
    emit('notify',`Lock for ${filename} successfully released!`, 'success')
    emit('reload-map', props.nodeName)
  } else {
    emit('notify', `Failed to release lock for ${filename}: ${result.error}`, 'error')
  }
}

async function uploadFile() {
  if (!selectedFile.value || selectedFile.value.length === 0) {
    emit('notify', 'No file selected', 'error')
    return
  }

  const formData = new FormData()
  formData.append('file', selectedFile.value[0])

  const apiUrl = `/${props.nodeName}/node/file/frontend`
  const result = await useApiCall(apiUrl, 'post', formData)

  if (result.success) {
    emit('notify', `File uploaded successfully`, 'success')
    emit('reload-map', props.nodeName)
    selectedFile.value = null
  } else {
    emit('notify', `Upload failed: ${result.error}`, 'error')
  }
}
</script>

<style scoped>
.v-card-text {
  max-height: 400px;
  overflow-y: auto;
}
</style>
