<template>
  <v-container style="text-align: center">
    <v-card style="margin-top: 100px; margin-bottom: 70px">
      <v-container>
        <v-form ref="form" v-model="valid" :lazy-validation="lazy">
          <v-row>
            <v-col cols="12">
              <h1
                style="color: gray; font-size: 60px"
                class="mb-4 mt-2 text-start"
              >
                LOG IN
                <v-icon size="65" style="margin-bottom: 9px">
                  mdi-account
                </v-icon>
              </h1>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                :rules="passwordRules"
                label="Password"
                outlined
                @click:append="show = !show"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="text-start">
              If you don't have any account <a href="/cReg">Click</a>
            </v-col>
          </v-row>
          <v-btn class="mt-10 mr-2 mb-3" @click="submit" color="success">
            Log in
          </v-btn>
          <v-btn class="mt-10 mb-3" @click="reset" color="error">Reset</v-btn>
        </v-form>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { auth } from "@/plugins/firebaseConfig.js";
export default {
  data: () => ({
    show: false,
    email: null,
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    password: null,
    passwordRules: [v => !!v || "Password is required"]
  }),
  methods: {
    submit() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(userCredential => {
          console.log(userCredential);
          alert("Login Success");
          this.$router.replace("/about");
        })
        .catch(error => {
          var errorCode = error.code;
          console.log(errorCode);
          var errorMessage = error.message;
          alert(errorMessage);
        });
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>

<style></style>
