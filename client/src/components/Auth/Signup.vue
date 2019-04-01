<template>
  <v-container text-xs-center mt-5 pt-5>

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Get started here</h1>
      </v-flex>
    </v-layout>

    <!--errors-->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!--signup form-->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="primary" dark>
          <v-container>
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleSignUpUser">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="emailRules" v-model="email" prepend-icon="face" label="Email" type="text" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="password" prepend-icon="extension" label="Password" type="password" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="passwordConfirmation" prepend-icon="gavel" label="Confirm Password" type="password" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn color="accent" :disabled="!isFormValid || loading" type="submit" :loading="loading">Sign up
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </template>
                  </v-btn>
                  <h3>Already have an account?
                    <router-link to="/signin">Sign in</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Signup',
  data() {
    return {
      isFormValid: true,
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      usernameRules: [
        username => !!username || 'Username is required',
        username => username.length < 10 || "Username cannot be more than 10 characters"
      ],
      emailRules: [
        email => !!email || 'Email is required',
        email => /.@+./.test(email)
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password => password.length >= 4 || "Password must be least 4 characters",
        confirmation => confirmation === this.password || "Passwords must match"
      ]
    }
  },
  watch: {
    user(value) {
      // if user value changes , redirect to homepagae
      if (value) {
        this.$router.push('/');
      }
    }
  },
  computed: {
    ...mapGetters(['loading', 'error', 'user'])
  },
  methods: {
    handleSignUpUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signupUser', {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    }
  }
}
</script>
