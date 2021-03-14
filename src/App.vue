<template>
  <v-app>
    <v-app-bar app clipped-left flat fixed dark color="light">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-app-bar-title>IMPOSSIBLE HOTEL</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary app clipped flat>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="black--text text--accent-4"
        >
          <v-list-item to="/home">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Select Room</v-list-item-title>
          </v-list-item>

          <hr />

          <v-list-item to="/adminLog">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Admin Only</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Router -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <v-footer dark padless>
      <v-card-text class="py-2 white--text text-center">
        {{ new Date().getFullYear() }} — <strong>IMPOSSIBLE HOTEL</strong>
      </v-card-text>
    </v-footer>
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {},

  data: () => ({
    drawer: false,
    group: null,
    items: [
      ["mdi-home", "Home", "/"],
      ["mdi-account", "Register", "/cReg"],
      ["mdi-account-tie", "Admin only", "#"]
    ],
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"]
  })
};
</script>
