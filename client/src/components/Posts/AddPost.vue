<template>
  <v-container text-xs-center mt-5 pt-5>

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">Add Post</h1>
      </v-flex>
    </v-layout>

    <!--signup form-->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>

        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPost">

          <!--Title input-->
          <v-layout row>
            <v-flex xs12>
              <v-text-field :rules="titleRules" v-model="title" prepend-icon="face" label="Post Title" type="text" required></v-text-field>
            </v-flex>
          </v-layout>

          <!--Image url input-->
          <v-layout row>
            <v-flex xs12>
              <v-text-field :rules="imageRules" v-model="imageUrl" prepend-icon="face" label="Image URL" type="text" required></v-text-field>
            </v-flex>
          </v-layout>

          <!--Image preview -->
          <v-layout row>
            <v-flex xs12>
              <img :src="imageUrl" height="300px">
            </v-flex>
          </v-layout>

          <!--Categories select-->
          <v-layout row>
            <v-flex xs12>
              <v-select :rules="categoryRules" v-model="categories" :items="['Art', 'Education', 'Travel', 'Photography', 'Technology']" multiple label="Categories"></v-select>
            </v-flex>
          </v-layout>

          <!--Description -->
          <v-layout row>
            <v-flex xs12>
              <v-textarea :rules="descRules" v-model="description" label="Description" type="text" required></v-textarea>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn color="accent" :disabled="!isFormValid || loading" type="submit" :loading="loading">
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </template>
                Submit
              </v-btn>

            </v-flex>
          </v-layout>
        </v-form>

      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'AddPost',
  data() {
    return {
      isFormValid: true,
      title: '',
      imageUrl: '',
      categories: [],
      description: '',
      titleRules: [
        title => !!title || 'Title is required',
        title => title.length < 20 || 'Title must have less than 20 characters'
      ],
      imageRules: [
        image => !!image || 'Image is required'
      ],
      categoryRules: [
        categories => categories.length >= 1 || 'At least 1 category is required'
      ],
      descRules: [
        description => !!description || 'Description is required',
        description => description.length < 200 || 'Description must have less than 20 characters'
      ]
    }
  },
  computed: {
    ...mapGetters(['loading', 'user'])
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addPost', {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        });
        this.$router.push("/");
      }
    }
  }

}
</script>
