<template>
  <v-container>
    <v-card style="margin-top: 40px" class="mb-8">
      <v-container>
        <h1 style="margin-bottom: 20px; font-size: 60px; color: gray">
          Register
          <v-icon size="60">mdi-account</v-icon>
        </h1>
        <form id="cusRegister" style="text-align: center;">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="fName"
                :error-messages="firstNameErrors"
                :counter="20"
                label="First Name"
                outlined
                required
                @input="$v.fName.$touch()"
                @blur="$v.fName.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="lName"
                :error-messages="lastNameErrors"
                :counter="20"
                label="Last Name"
                outlined
                required
                @input="$v.lName.$touch()"
                @blur="$v.lName.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="E-mail"
                outlined
                required
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                :error-messages="passwordErrors"
                label="Password"
                outlined
                @click:append="show1 = !show1"
                required
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="checkPassword"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show2 ? 'text' : 'password'"
                :error-messages="checkPasswordErrors"
                label="Confirm Password"
                outlined
                @click:append="show2 = !show2"
                required
                @input="$v.checkPassword.$touch()"
                @blur="$v.checkPassword.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="tel"
                type="number"
                :error-messages="checkPhoneErrors"
                :counter="10"
                label="Phone Number"
                outlined
                pattern="0[0-9]{9}"
                required
                @input="$v.tel.$touch()"
                @blur="$v.tel.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="checkbox"
                :error-messages="checkboxErrors"
                label="Do you agree?"
                required
                @change="$v.checkbox.$touch()"
                @blur="$v.checkbox.$touch()"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-btn
                class="mr-4"
                @click="submit"
                color="success"
                :disabled="invalid"
              >
                submit
              </v-btn>
              <v-btn @click="clear" color="error">
                Reset
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  email,
  minLength
} from "vuelidate/lib/validators";
import { db } from "@/plugins/firebaseConfig.js";
import { auth } from "@/plugins/firebaseConfig.js";

export default {
  mixins: [validationMixin],

  validations: {
    fName: { required, maxLength: maxLength(20) },
    lName: { required, maxLength: maxLength(20) },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    checkPassword: { required },
    tel: { required, maxLength: maxLength(10), minLength: minLength(7) },
    checkbox: {
      checked(val) {
        return val;
      }
    }
  },

  data: () => ({
    fName: "",
    lName: "",
    email: "",
    tel: "",
    password: "",
    checkPassword: "",
    show1: false,
    show2: false,
    checkbox: false
  }),

  computed: {
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked && errors.push("You must agree to continue!");
      return errors;
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.fName.$dirty) return errors;
      !this.$v.fName.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.fName.required && errors.push("Name is required.");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lName.$dirty) return errors;
      !this.$v.lName.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.lName.required && errors.push("Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push("Password must have at least 6 letters");
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
    checkPasswordErrors() {
      const errors = [];
      if (!this.$v.checkPassword.$dirty) return errors;
      if (this.checkPassword != this.password) {
        errors.push("Password was invalid Pls Check!");
      }
      !this.$v.checkPassword.required && errors.push("Password is required");
      return errors;
    },
    checkPhoneErrors() {
      const errors = [];
      if (!this.$v.tel.$dirty) return errors;
      !this.$v.tel.maxLength && errors.push("Tel is invalid!");
      !this.$v.tel.minLength &&
        errors.push("Phone number must have at least 7 digit");
      !this.$v.tel.required && errors.push("Tel is required");
      return errors;
    }
  },

  methods: {
    submit() {
      this.$v.$touch();

      // add data to database
      if (!this.$v.$invalid) {
        const data = {
          cusEmail: this.email,
          cusFullName: this.fName + " " + this.lName,
          cusPhone: this.tel.toString()
        };
        db.collection("users")
          .doc(data.cusEmail)
          .set(data);
        alert("Register Success");
        this.$router.replace("/cLog");

        auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(userData => {
            console.log(userData);
          })
          .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
            console.log(errorMessage);
            if (errorCode == "auth/weak-password") {
              alert("The password is too weak.");
            } else {
              console.log(error);
            }
          });

        // reset after submit success
        this.$v.$reset();
        this.fName = "";
        this.lName = "";
        this.email = "";
        this.password = "";
        this.tel = "";
        this.checkPassword = "";
        this.checkbox = false;
      }
    },
    clear() {
      this.$v.$reset();
      this.fName = "";
      this.lName = "";
      this.email = "";
      this.password = "";
      this.tel = "";
      this.checkPassword = "";
      this.checkbox = false;
    }
  }
};
</script>

<style scoped>
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
