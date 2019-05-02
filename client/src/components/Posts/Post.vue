<template>
  <v-container
    v-if="getPost"
    cass="mt-3"
    flexbox
    center
  >
    <v-layout
      row
      wrap
    >
      <v-flex>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn
              large
              icon
            >
              <v-icon
                large
                color="grey"
              >favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{getPost.likes}} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon
              color="info"
              large
              @click="goToPreviousPage"
            >arrow_back</v-icon>
          </v-card-title>
          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-card-media
              slot="activator"
              :src="getPost.imageUrl"
              id="post__image"
              @click="toggleImageDialog"
            ></v-card-media>
          </v-tooltip>

          <!--Enlarged post image-->
          <v-dialog v-model="dialog">
            <v-card>
              <v-card-media
                :src="getPost.imageUrl"
                height="80vh"
              ></v-card-media>
            </v-card>
          </v-dialog>
          <v-card-text>
            <span
              v-for="(category, index) in getPost.categories"
              :key="index"
            >
              <v-chip
                class="mb-3"
                color="accent"
                text-color="white"
              >{{category}}</v-chip>
            </span>
            <h3>{{getPost.description}}</h3>
          </v-card-text>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_POST } from "../../queries";

export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      dialog: false
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    }
  }
};
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>