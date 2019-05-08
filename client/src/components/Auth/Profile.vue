<template>
  <v-container class="text-xs-center">
    <!-- User details card-->
    <v-flex
      sm6
      offset-sm3
    >
      <v-card
        class="white--text"
        color="secondary"
      >
        <v-layout>
          <v-flex xs5>
            <v-card-media
              height="125px"
              contain
              :src="user.avatar"
            ></v-card-media>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>Joined {{user.joinDate}}</div>
                <div class="hidden-xs-only font-weight-thin">{{user.favorites.length}} Favorites</div>
                <div class="hidden-xs-only font-weight-thin">{{userPosts.length}} Posts Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!--Favorited-->
    <v-container v-if="!userFavorites.length">
      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <h2>You have no favorites currently. Go and add some.</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container
      class="mt-3"
      v-else
    >
      <v-flex xs12>
        <h2 class="font-weight-light">
          Favorited <span class="font-weight-regular">{{userFavorites.length}}</span>
        </h2>
      </v-flex>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          sm6
          v-for="favorite in userFavorites"
          :key="favorite._id"
        >
          <v-card
            class="mt-3 ml-1 mr-2"
            hover
          >
            <v-card-media
              height="30vh"
              :src="favorite.imageUrl"
            ></v-card-media>
            <v-card-text>{{favorite.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!--posts created by user-->
    <v-container v-if="!userPosts.length">
      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <h2>You have no posts currently. Go and add some.</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container
      class="mt-3"
      v-else
    >
      <v-flex xs12>
        <h2 class="font-weight-light">Your Posts
          <span class="font-weight-regular">({{userPosts.length}})</span>
        </h2>
      </v-flex>
      <v-layout>
        <v-flex
          xs12
          sm6
          v-for="post in userPosts"
          :key="post._id"
        >
          <v-card
            class="mt-3 ml-1 mr-2"
            hover
          >
            <v-btn
              color="info"
              floating
              fab
              small
              dark
              @click="editPostDialog = true"
            >
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn
              color="error"
              floating
              fab
              small
              dark
            >
              <v-icon>delete</v-icon>
            </v-btn>

            <v-card-media
              height="30vh"
              :src="post.imageUrl"
            ></v-card-media>
            <v-card-text>{{post.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

    </v-container>

    <v-dialog
      persistent
      xs12
      sm6
      offset-sm3
      v-model="editPostDialog"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">Update post</v-card-title>

        <v-container>
          <v-form
            v-model="isFormValid"
            lazy-validation
            ref="form"
            @submit.prevent="handleUpdateUserPost"
          >

            <!--Title input-->
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  :rules="titleRules"
                  v-model="title"
                  prepend-icon="face"
                  label="Post Title"
                  type="text"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!--Image url input-->
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  :rules="imageRules"
                  v-model="imageUrl"
                  prepend-icon="face"
                  label="Image URL"
                  type="text"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!--Image preview -->
            <v-layout row>
              <v-flex xs12>
                <img
                  :src="imageUrl"
                  height="300px"
                >
              </v-flex>
            </v-layout>

            <!--Categories select-->
            <v-layout row>
              <v-flex xs12>
                <v-select
                  :rules="categoryRules"
                  v-model="categories"
                  :items="['Art', 'Education', 'Travel', 'Photography', 'Technology']"
                  multiple
                  label="Categories"
                ></v-select>
              </v-flex>
            </v-layout>

            <!--Description -->
            <v-layout row>
              <v-flex xs12>
                <v-textarea
                  :rules="descRules"
                  v-model="description"
                  label="Description"
                  type="text"
                  required
                ></v-textarea>
              </v-flex>
            </v-layout>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                type="submit"
                class="success-text"
                flat
              >Update</v-btn>
              <v-btn
                class="error--text"
                flat
                @click="editPostDialog = false"
              >Cancel</v-btn>
            </v-card-actions>

          </v-form>
        </v-container>
      </v-card>

    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Profile",
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 20 || "Title must have less than 20 characters"
      ],
      imageRules: [image => !!image || "Image is required"],
      categoryRules: [
        categories =>
          categories.length >= 1 || "At least 1 category is required"
      ],
      descRules: [
        description => !!description || "Description is required",
        description =>
          description.length < 200 ||
          "Description must have less than 20 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "userFavorites", "userPosts"])
  },
  created() {
    this.handleGetUserPosts();
  },
  methods: {
    handleGetUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id
      });
    },
    handleUpdateUserPost() {}
  }
};
</script>
