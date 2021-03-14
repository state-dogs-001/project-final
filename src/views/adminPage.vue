<template>
  <v-app>
    <v-card style="background-color: gray" dark>
      <v-container>
        <h1>
          Admin Page
        </h1>
        <br />
        <h4>Hello {{ user }}</h4>
        <v-btn @click="logout" color="error">Log out</v-btn>
      </v-container>
    </v-card>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mt-10" elevation="2" outlined shaped>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      ID Room
                    </th>
                    <th class="text-left">
                      Check In
                    </th>
                    <th class="text-left">
                      Customer Email
                    </th>
                    <th class="text-left">
                      Stay In
                    </th>
                    <th class="text-left">
                      Price
                    </th>
                    <th class="text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in dataList" :key="item">
                    <td>{{ item.idRoom }}</td>
                    <td>{{ item.checkIn }}</td>
                    <td>{{ item.cusEmail }}</td>
                    <td>{{ item.stayIn }}</td>
                    <td>{{ item.price }} ฿</td>
                    <td style="color: green">{{ item.status }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="mt-10" elevation="2" outlined>
            <v-container class="text-center">
              <h2 class="text-start">Admin Controler</h2>
              <v-text-field
                class="mt-4"
                v-model="idRoom"
                outlined
                placeholder="ID Room"
              />
              <v-text-field
                class="mt-4"
                v-model="idUser"
                outlined
                placeholder="User Email"
              />
              <v-btn @click="update" color="success" class="mr-2"
                >Check In</v-btn
              >
              <v-btn @click="cansel" color="error">Cancel Room</v-btn>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { auth } from "@/plugins/firebaseConfig.js";
import { db } from "@/plugins/firebaseConfig.js";
export default {
  data: () => ({
    user: null,
    idRoom: null,
    idUser: null,
    dataList: []
  }),
  beforeCreate() {
    auth.onAuthStateChanged(user => {
      if (user != null) {
        if (user.email == "test@test.com") {
          this.user = user.email;
          console.log(this.user);
        } else {
          this.$router.replace("/adminLog");
        }
      } else {
        console.log(this.user);
        this.$router.replace("/adminLog");
      }
    });
  },
  created() {
    this.getData();
  },
  methods: {
    logout() {
      auth
        .signOut()
        .then(() => {
          alert("Sign-Out Successfully");
        })
        .catch(err => {
          console.log(err);
        });
    },
    getData() {
      db.collection("rentRoom")
        .orderBy("checkIn")
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            console.log(doc.id);
            this.dataList.push(doc.data());
          });
        });
    },
    update() {
      db.collection("rentRoom")
        .doc(this.idRoom + "_" + this.idUser)
        .update({
          status: "Stay in"
        })
        .then(() => {
          console.log("Document successfully updated!");
          this.$router.go("/adminPage");
        })
        .catch(error => {
          // The document probably doesn't exist.
          console.log("Error updating document: ", error);
          alert("Somthing Wrong!");
        });
      db.collection("room")
        .doc(this.idRoom)
        .update({
          status: false
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch(error => {
          // The document probably doesn't exist.
          console.log("Error updating document: ", error);
          alert("Somthing Wrong!");
        });
    },
    cansel() {
      db.collection("rentRoom")
        .doc(this.idRoom + "_" + this.idUser)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          this.$router.go("/adminPage");
        })
        .catch(error => {
          console.error("Error removing document: ", error);
        });
      db.collection("room")
        .doc(this.idRoom)
        .update({
          status: true
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch(error => {
          // The document probably doesn't exist.
          console.log("Error updating document: ", error);
          alert("Somthing Wrong!");
        });
    }
  }
};
</script>

<style></style>
