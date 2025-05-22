<template>
  <v-container>
    <v-container>
      <div class="text-h5 font-weight-bold" style="margin-left: 2%">Servers</div>
      <ServerList/>
    </v-container>
    <v-divider style="margin-left: 2.5%; margin-right: 2.5%"/>
    <v-container>
      <div class="text-h5 font-weight-bold" style="margin-left: 2%">Nodes</div>
      <NodeList/>
    </v-container>
  </v-container>
</template>

<script lang="ts" setup>


import NodeList from "@/components/NodeList.vue";
import ServerList from "@/components/ServerList.vue";
</script>
