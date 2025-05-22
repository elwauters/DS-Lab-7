<template>
  <v-card class="ma-4" elevation="4" color="grey-lighten-4">
    <v-list-item height="88">
      <template v-slot:title>
        <v-card-title>
          {{ node.name }}
          <span style="" class="font-weight-light text-subtitle-2 text-grey">({{ node.ip}})</span>
        </v-card-title>
      </template>

      <template v-slot:append>
        <v-chip :color="node.online ? 'green' : 'red'" dark>
          {{ node.online ? 'Online' : 'Offline' }}
        </v-chip>
      </template>
    </v-list-item>
    <v-divider></v-divider>
    <v-card-text>
      <div>
        Previous node <strong>{{ node.previous }}</strong>
      </div>
      <div>
        Next node <strong>{{ node.next }}</strong>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn variant="tonal" :color="'grey'">
        <template v-slot:prepend>
          <v-icon icon="mdi-power" color="success"></v-icon>
        </template>
        Start
      </v-btn>
      <v-btn variant="tonal" :color="'grey'">
        <template v-slot:prepend>
          <v-icon icon="mdi-power" color="error"></v-icon>
        </template>
        Shutdown
      </v-btn>
      <v-btn variant="tonal" :color="'grey'">
        <template v-slot:prepend>
          <v-icon icon="mdi-information" color="info"></v-icon>
        </template>
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  node: {
    id: number;
    name: string;
    online: boolean;
    ip: string;
    previous: string;
    next: string;
  };
}>();
</script>
