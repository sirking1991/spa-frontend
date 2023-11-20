<template>
      <div class="container w-25 mt-5 shadow">
        <h3>Register</h3>
        <form @submit.prevent="register">
          <input class="form-control" placeholder="Name" type="text" v-model="name" required />
          <input class="form-control mt-2" placeholder="Email" type="email" v-model="email" required />
          <input class="form-control mt-2" placeholder="Password" type="password" v-model="password" required />
          <input class="form-control mt-2" placeholder="Confirm password" type="password" v-model="password_confirmation" required />

          <button class="btn btn-primary mt-3 btn-block" type="submit">Register</button>

          <a v-on:click="forwardToLogin" class="btn btn-link d-block">Already registered? Click here to login</a>
        </form>
      </div>
  </template>
  
  <script>
  export default {
    data() {
        return {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        };
    },
    methods: {
        forwardToLogin() {
            this.$router.push("/login");
        },
        async register() {
            try {
                const response = await this.$axios.post("/register", {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.password_confirmation,
                });
                console.log(response.data);
                const token = response.data.token;
                // Store the token in a secure way, such as using Vuex or localStorage
                localStorage.setItem("token", token);
                this.$router.push("/");
            }
            catch (error) {
                console.error(error);
                // handle error
            }
        },
    }
};
  </script>
  