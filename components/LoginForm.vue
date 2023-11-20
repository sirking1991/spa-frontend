<template>
      <div class="container w-25 mt-5">
        <h3>Login</h3>
        <form @submit.prevent="login">
          <input class="form-control" placeholder="Email" type="email" id="email" v-model="email" required />
          <input class="form-control mt-2" placeholder="Password" type="password" id="password" v-model="password" required />
          <button class="btn btn-primary mt-3 btn-block" type="submit">Login</button>

          <a v-on:click="forwardToRegister" class="btn btn-link d-block">New user? Click here to register</a>
        </form>

        <b-alert v-show="errorMessage.length>0" class="mt-3" show variant="danger">{{errorMessage}}</b-alert>
      </div>
  </template>
  
  <script>
import NuxtLogo from './NuxtLogo.vue';

  export default {
    data() {
        return {
            email: "",
            password: "",
            errorMessage: "",
        };
    },
    methods: {
        forwardToRegister() {
            this.$router.push("/register");
        },
        async login() {
            try {
                this.errorMessage = "";
                const response = await this.$axios.post("/login", {
                    email: this.email,
                    password: this.password,
                });
                const token = response.data.token;
                // Store the token in a secure way, such as using Vuex or localStorage
                localStorage.setItem("token", token);
                this.$router.push("/");
            }
            catch (error) {
                console.error(error);
            }
        },
    },
    components: { NuxtLogo }
};
  </script>
  