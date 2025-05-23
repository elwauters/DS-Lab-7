<template>
  <div>
    <v-dialog v-model="show" max-width="600">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Node Map
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item
              v-for="(name, id) in nodeMap"
              :key="id"
            >
              <v-list-item-content>
                <v-list-item-title>ID: {{ id }}</v-list-item-title>
                <v-list-item-subtitle>Name: {{ name }}</v-list-item-subtitle>
              </v-list-item-content>
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
