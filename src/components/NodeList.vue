<template>
  <v-container>
    <v-row>
      <v-col
        v-for="node in nodes"
        :key="node.id"
        cols="12"
        md="6"
        lg="4"
      >
        <NodeCard :node="node"
          @notify="(message:string, color:string) => $emit('notify', message, color)"
          @update-status="updateNode"
          @update-np="updateNextAndPrevious"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import NodeCard from './NodeCard.vue'
import {Node} from "@/models/Node";
import {ref} from "vue";
import {useApiCall} from "@/composables/useApi";

const emit = defineEmits<{
  (e: 'node-changed'): void;
  (e: 'notify', message: string, color: string): void;
}>();


const nodes = ref<Node[]>([
  new Node(1, 'g2c2', false, '172.19.0.4', 'N/A', 'N/A', 'N/A'),
  new Node(2, 'g2c3', false, '172.19.0.5', 'N/A', 'N/A', 'N/A'),
  new Node(3, 'g2c4', false, '172.19.0.2', 'N/A', 'N/A', 'N/A'),
  new Node(4, 'g2c5', false, '172.19.0.3', 'N/A', 'N/A', 'N/A'),
]);

function updateNode({ id, online }: { id: number; online: boolean }) {
  const targetNode = nodes.value.find(n => n.id === id);

  // If node that was online is being turned off
  if (targetNode?.online && !online) {
    targetNode.nextId = 'N/A';
    targetNode.previousId = 'N/A';
    targetNode.nodeId = 'N/A';
  }

  if (targetNode) {targetNode.online = online;}
  emit('node-changed');
}

async function updateNextAndPrevious() {
  let error = false;

  // Small delay to give Node time to set its next and previous in the backend
  await new Promise(resolve => setTimeout(resolve, 2500));
  for (const node of nodes.value) {
    if (node.online) {
      let apiUrl = `/${node.name}/node/nextAndPrevious`;
      let result = await useApiCall(apiUrl, 'get')

      if (result.success) {
        node.nextId = result.data.nextID;
        node.previousId = result.data.previousID;
      } else {
        node.nextId = 'N/A';
        node.previousId = 'N/A';
        error = true;
      }

      apiUrl = `/${node.name}/node/current`
      result = await useApiCall(apiUrl, 'get')

      if (result.success) {
        node.nodeId = result.data;
      } else {
        node.nodeId = 'N/A';
      }
    }
  }

  if (!error) {
    emit('notify', `Fetched next and previous of all nodes successfully`, 'success');
  } else {
    emit('notify', `Failed to fetch next and previous for one or more nodes`, 'error');
  }
}

</script>
