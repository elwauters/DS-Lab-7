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
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import NodeCard from './NodeCard.vue'
import {Node} from "@/models/Node";


const nodes = [
  new Node(1, 'g2c2', false, '172.19.0.4', "N/A", "N/A"),
  new Node(2, 'g2c3', false, '172.19.0.5', "N/A", "N/A"),
  new Node(3, 'g2c4', false, '172.19.0.2', "N/A", "N/A"),
  new Node(4, 'g2c5', false, '172.19.0.3', "N/A", "N/A"),
];
</script>
