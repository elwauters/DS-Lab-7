<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-nav-icon
        class="hidden-sm-and-up"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-avatar
        class="me-10 ms-4"
        color="grey-darken-1"
        size="32"
      ></v-avatar>

      <v-container class="fill-height d-flex align-center">
        <span
          v-for="link in navigation_links"
          :key="link.name"
        >
        </span>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer
      class="hidden-sm-and-up"
      v-model="drawer"
      temporary
    >
      <v-list
        :lines="false"
        density="compact"
        nav
      >
        <span
          v-for="link in navigation_links"
          :key="link.name"
        >
        </span>
      </v-list>
    </v-navigation-drawer>

    <v-main :class="theme.global.current.value.dark ? 'black': 'bg-grey-lighten-3'">
      <v-container>
        <v-sheet
          min-height="70vh"
          rounded="lg"
        >
          <RouterView/>
        </v-sheet>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import {useTheme} from 'vuetify'
import {ref} from "vue";
import config from "../../config";

const theme = useTheme()
const drawer = ref(false)
const navigation_links = config["NAVIGATION"]

</script>
