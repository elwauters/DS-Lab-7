<template>
  <div>
    <v-dialog v-model="show" max-width="600">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Node Map
        </v-card-title>
        <v-divider/>
        <v-card-text v-if="Object.keys(nodeMap).length === 0">
          All nodes are currently offline.
        </v-card-text>
        <v-card-text v-if="Object.keys(nodeMap).length > 0">
          <v-list dense>
            <v-list-item
              v-for="(ip, id) in nodeMap"
              :key="id"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-circle-double"></v-icon>
              </template>
              <v-list-item-title>{{ id }}</v-list-item-title>
              <v-list-item-subtitle>{{ ip }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="show = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  nodeMap: Record<string, string>
}>()

const emit = defineEmits(['update:modelValue'])

const show = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  show.value = val
})

watch(show, (val) => {
  emit('update:modelValue', val)
})
</script>

<style scoped>
.v-card-text {
  max-height: 400px;
  overflow-y: auto;
}
</style>
