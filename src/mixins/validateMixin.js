import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  validations: {
    first_name: { required, maxLength: maxLength(10) },
    last_name: { required, maxLength: maxLength(10) },
  },
  computed: {
    firstNameErrors() {
      const errors = [];
      if (!this.$v.first_name.$dirty) return errors;
      !this.$v.first_name.maxLength &&
        errors.push("First Name must be at most 10 characters long");
      !this.$v.first_name.required && errors.push("Name is required.");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.last_name.$dirty) return errors;
      !this.$v.last_name.maxLength &&
        errors.push("Last Name must be at most 10 characters long");
      !this.$v.last_name.required && errors.push("Name is required.");
      return errors;
    },
  },
};
