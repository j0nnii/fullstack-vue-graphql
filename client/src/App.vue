<template>
  <v-app style="background: #E3E3E3;">
    <v-navigation-drawer
      app
      temporary
      fixed
      v-model="sideNav"
      value="false"
    >
      <v-toolbar
        color="accent"
        dark
        flat
      >
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <router-link
          to="/"
          tag="span"
          style="cursor:pointer;"
        >
          <h1 class="title pl-3">VueShare</h1>
        </router-link>
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

        <v-list-tile
          v-if="user"
          @onclick="handleSignoutUser"
        >
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Sign out</v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>
    <v-toolbar
      fixed
      color="primary"
      dark
    >
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link
          to="/"
          tag="span"
          style="cursor:pointer;"
        >VueShare</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-text-field
        v-model="searchTerm"
        @input="handleSearchPosts"
        flex
        prepend-icon="search"
        placeholder="Search posts"
        color="accent"
        single-line
        hide-details
      ></v-text-field>

      <v-card
        dark
        v-if="searchResults.length"
        id="search__card"
      >
        <v-list>
          <v-list-tile
            @click="goToSearchResult(result._id)"
            v-for="result in searchResults"
            :key="result._id"
          >
            <v-list-tile-title>
              {{result.title}}
              <span class="font-weight-thin">{{formatDescription(result.description)}}</span>
            </v-list-tile-title>

            <v-list-tile-action v-if="checkIfUserFavorite(result._id)">
              <v-icon>favorite</v-icon>
            </v-list-tile-action>

          </v-list-tile>
        </v-list>
      </v-card>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in horizontalNavItems"
          :key="item.title"
          :to="item.link"
        >
          <v-icon
            class="hidden-sm-only"
            left
          >{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <v-btn
          flat
          to="/profile"
          v-if="user"
        >
          <v-icon
            class="hidden-sm-only"
            left
          >account_box</v-icon>
          <v-badge
            right
            color="blue darken-2"
            :class="{'bounce': badgeAnimated}"
          >
            <span
              slot="badge"
              v-if="userFavorites.length"
            >{{userFavorites.length}}</span>
            Profile
          </v-badge>
        </v-btn>

        <v-btn
          flat
          v-if="user"
          @click="handleSignoutUser"
        >
          <v-icon
            class="hidden-sm-only"
            left
          >exit_to_app</v-icon>
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
        <v-snackbar
          v-model="authSnackbar"
          color="success"
          :timeout='5000'
          bottom
          left
        >
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn
            dark
            flat
            @click="authSnackbar = false"
          >Close</v-btn>
        </v-snackbar>

        <!--Auth Error snackbar-->
        <v-snackbar
          v-if="authError"
          v-model="authErrorSnackbar"
          color="warning"
          :timeout='5000'
          bottom
          left
        >
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn
            dark
            flat
            to="/signin"
          >Sign in</v-btn>
        </v-snackbar>

      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      badgeAnimated: false,
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      searchTerm: ""
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
    },
    userFavorites(value) {
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },
  computed: {
    ...mapGetters(["authError", "user", "userFavorites", "searchResults"]),

    horizontalNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign in", link: "/signin" },
        { icon: "create", title: "Sign up", link: "/signup" }
      ];
      if (this.user) {
        items = [{ icon: "chat", title: "Posts", link: "/posts" }];
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
    checkIfUserFavorite(resultId) {
      return (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === resultId)
      );
    },
    goToSearchResult(resultId) {
      this.searchTerm = "";
      this.$router.push(`/posts/${resultId}`);
      this.$store.commit("clearSearchResults");
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    handleSignoutUser() {
      this.$store.dispatch("signoutUser");
    },
    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
    },
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm
      });
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

#search__card {
  position: "absolute";
  width: 100vw;
  z-index: 8;
  top: 150px;
  left: 0;
}

.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
