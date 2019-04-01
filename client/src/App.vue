<template>
  <v-app style="background: #E3E3E3;">
    <v-navigation-drawer app temporary fixed v-model="sideNav" value="false">
      <v-toolbar color="accent" dark flat>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <router-link to="/" tag="span" style="cursor:pointer;"
          ><h1 class="title pl-3">VueShare</h1></router-link
        >
      </v-toolbar>
      <v-divider></v-divider>

      <v-list>
        <v-list-tile
          v-for="item in sideNavItems"
          :key="item.title"
          :to="item.link"
          ripple
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        </v-btn>

        <v-list-tile v-if="user" @onclick="handleSignoutUser">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Sign out</v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>
    <v-toolbar fixed color="primary" dark>
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor:pointer;"
          >VueShare</router-link
        >
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-text-field
        flex
        prepend-icon="search"
        placeholder="Search posts"
        color="accent"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in horizontalNavItems"
          :key="item.title"
          :to="item.link"
        >
          <v-icon class="hidden-sm-only" left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <v-btn flat to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
            <v-badge right color="blue darken-2">
              <span slot="badge">1</span>
              Profile
            </v-badge>
        </v-btn>

        <v-btn flat v-if="user" @click="handleSignoutUser">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
          Sign out
        </v-btn>

      </v-toolbar-items>
    </v-toolbar>
    <main>
      <v-container class="mt-4">
        <transition name="fade">
          <router-view />
        </transition>

      <!--Auth snackbar-->
      <v-snackbar v-model="authSnackbar" color="success" :timeout='5000' bottom left>
        <v-icon class="mr-3">check_circle</v-icon>
        <h3>You are now signed in!</h3>
        <v-btn dark flat @click="authSnackbar = false">Close</v-btn>
      </v-snackbar>

      <!--Auth Error snackbar-->
      <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="warning" :timeout='5000' bottom left>
        <v-icon class="mr-3">cancel</v-icon>
        <h3>{{authError.message}}</h3>
        <v-btn dark flat to="/signin">Sign in</v-btn>
      </v-snackbar>

      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "App",
  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false
    };
  },
  watch: {
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    }
  },
  computed: {
    ...mapGetters(['authError', 'user']),

    horizontalNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign in", link: "/signin" },
        { icon: "create", title: "Sign up", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "chat", title: "Posts", link: "/posts" }
        ];
      }
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign in", link: "/signin" },
        { icon: "create", title: "Sign up", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "chat", title: "Posts", link: "/posts" },
          { icon: "stars", title: "Create Post", link: "/post/add" },
          { icon: "account_box", title: "Profile", link: "/profile" }
        ];
      }
      return items;
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    handleSignoutUser() {
      this.$store.dispatch('signoutUser');
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

</style>
