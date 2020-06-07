<template>
  <div class="text-center">
    <form>
      <v-text-field
        v-model="first_name"
        :error-messages="firstNameErrors"
        :counter="10"
        label="First Name"
        required
        @input="$v.first_name.$touch()"
        @blur="$v.first_name.$touch()"
      ></v-text-field>

      <v-text-field
        v-model="last_name"
        :error-messages="lastNameErrors"
        :counter="10"
        label="Last Name"
        required
        @input="$v.last_name.$touch()"
        @blur="$v.last_name.$touch()"
      ></v-text-field>

      <v-btn class="mr-4 green" @click="addUser()">Submit</v-btn>
      <v-btn class="mr-4 green" @click="updateUser()">Update</v-btn>
      <v-btn @click="clear">clear</v-btn>
    </form>

    <div class="users">
      <ul v-for="user of users" :key="user.id">
        <li class="name">{{user.first_name}} {{ user.last_name }}</li>
        <li class="email">{{user.phone}}</li>
        <a class="link" target="_blank" :href="baseURL+'/'+user.id">User Profile</a>
      </ul>
    </div>
  </div>
</template>

<script>
import validateMixin from "../../mixins/validateMixin";

import axios from "axios";

export default {
  name: "Form",
  mixins: [validateMixin],

  data() {
    return {
      first_name: "",
      last_name: "",
      users: [],
      baseURL: "https://users.ahmedwagih.dev/public/v1/users"
    };
  },

  async created() {
    try {
      const res = await axios.get(this.baseURL);
      this.users = res.data;
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
  },

  methods: {
    async addUser() {
      const res = await axios.post(this.baseURL, {
        first_name: this.first_name,
        last_name: this.last_name
      });

      this.users = [...this.users, res.data];
      this.clear();
    },

    async updateUser() {
      await axios.patch(this.baseURL + 1, {
        first_name: this.first_name,
        last_name: this.last_name
      });
    },

    clear() {
      this.$v.$reset();
      this.first_name = "";
      this.last_name = "";
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