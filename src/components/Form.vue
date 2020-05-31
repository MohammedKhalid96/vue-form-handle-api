<template>
  <div class="text-center">
    <form>
      <v-text-field
        v-model="imgURL"
        :error-messages="imgURLErrors"
        label="Image Url"
        required
        @input="$v.imgURL.$touch()"
        @blur="$v.imgURL.$touch()"
      ></v-text-field>
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

      <v-btn class="mr-4 green" @click="addUser()">submit</v-btn>
      <v-btn @click="clear">clear</v-btn>
    </form>

    <div class="users">
      <ul v-for="user of users" :key="user.id">
        <img class="avatar" :src="user.imgURL" />
        <li class="name">{{user.name}}</li>
        <li class="email">{{user.email}}</li>
        <a class="link" target="_blank" :href="baseURL+'/'+user.id">User Profile</a>
      </ul>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";

import axios from "axios";

export default {
  name: "Form",
  mixins: [validationMixin],

  validations: {
    imgURL: { required },
    name: { required, maxLength: maxLength(10) },
    email: { required, email }
  },

  data: () => ({
    imgURL: "",
    name: "",
    email: "",
    users: [],
    baseURL: "https://shawerly.net/public/v1/users"
  }),

  computed: {
    imgURLErrors() {
      const errors = [];
      if (!this.$v.imgURL.$dirty) return errors;
      !this.$v.imgURL.required && errors.push("Image URL is required.");
      return errors;
    },
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
      const res = await axios.get(this.baseURL);
      this.users = res.data;
      console.log(this.users);
    } catch (e) {
      console.error(e);
    }
  },

  methods: {
    async addUser() {
      const res = await axios.post(this.baseURL, {
        imgURL: this.imgURL,
        name: this.name,
        email: this.email
      });

      axios.patch(this.baseURL + "/" + res.data.id, {
        name: (this.name = "updated"),
        email: (this.email = "updated@gmail.com")
      });

      this.users = [...this.users, res.data];
      (this.imgURL = ""), (this.name = "");
      this.email = "";
    },
    clear() {
      this.$v.$reset();
      this.imgURL = "";
      this.name = "";
      this.email = "";
    }
  }
};
</script>

<style scoped>
ul {
  margin-top: 3em;
  padding-left: 0 !important;
}

li {
  list-style: none;
}

.avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.5em;
}

.name {
  color: #692104;
}

.email {
  margin-bottom: 0.5em;
}

.link {
  display: inline-block;
  text-decoration: none;
}
</style>