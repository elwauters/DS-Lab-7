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
        <ServerCard :server="server" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import ServerCard from './ServerCard.vue'
import {NamingServer} from "@/models/NamingServer";


const servers = [
  new NamingServer(1, 'g2c1', false, 0, "172.19.0.1"),
];
</script>
