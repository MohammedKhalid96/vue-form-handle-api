<template>
  <div>
    <form>
      <v-text-field
        v-model="name"
        :error-messages="nameErrors"
        :counter="10"
        label="Name"
        required
        @input="$v.name.$touch()"
        @blur="$v.name.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="email"
        :error-messages="emailErrors"
        label="E-mail"
        required
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
      ></v-text-field>

      <v-btn class="mr-4 green" @click="addUser">submit</v-btn>
      <v-btn @click="clear">clear</v-btn>
    </form>

    <div class="users">
      <ul v-for="user of users" :key="user.id">
        <li class="name">{{user.name}}</li>
        <li class="email">{{user.email}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";

import axios from "axios";
const baseURL = "http://localhost:3000/users";

export default {
  name: "Form",
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(10) },
    email: { required, email }
  },

  data: () => ({
    name: "",
    email: "",
    users: []
  }),

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    }
  },

  async created() {
    try {
      const res = await axios.get(baseURL);
      this.users = res.data;
    } catch (e) {
      console.error(e);
    }
  },

  methods: {
    submit() {
      this.$v.$touch();
    },
    async addUser() {
      const res = await axios.post(baseURL, {
        name: this.name,
        email: this.email
      });
      this.users = [...this.users, res.data];
      this.name = "";
      this.email = "";
    },
    clear() {
      this.$v.$reset();
      this.name = "";
      this.email = "";
    }
  }
};
</script>

<style scoped>
ul {
  margin-top: 2em;
  padding-left: 0 !important;
}

li {
  list-style: none;
}

.name {
  color: #692104;
}

.email {
  margin-bottom: 1em;
}
</style>