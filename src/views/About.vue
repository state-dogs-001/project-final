<template>
  <v-app>
    <v-card style="background-color: gray" class="mb-4" dark>
      <v-container>
        <v-row>
          <v-col cols="12" class="text-start">
            <h1 class="mt-5" style="font-size: 50px">
              <strong>Select Room</strong>
            </h1>
          </v-col>
          <v-col cols="12" class="text-start">
            <label>
              <strong style="font-size: 30px"
                >Welcome
                <label style="color: black">{{ user }}</label>
              </strong>
              <v-btn @click="logout" color="error" class="ml-3 mb-2">
                Log out
              </v-btn>
            </label>
          </v-col>
          <v-col cols="12" md="6" class="text-start"> </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-container fluid>
      <v-row>
        <v-col
          class="mt-2"
          cols="12"
          md="4"
          v-for="room in dataList"
          :key="room"
        >
          <v-hover v-slot="{ hover }">
            <v-card
              class="mx-auto text-center"
              max-width="400"
              :elevation="hover ? 12 : 2"
              outlined
              shaped
            >
              <v-img
                class="white--text align-end"
                height="200px"
                :src="room.roomURL"
              >
                <v-expand-transition>
                  <div
                    v-if="hover"
                    class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
                    style="height: 100%;"
                  >
                    {{ room.price }} ฿
                  </div>
                </v-expand-transition>
              </v-img>

              <v-card-subtitle class="pb-0 red--text">
                <h2>ID: {{ room.idRoom }}</h2>
                <h3>Size: {{ room.sizeRoom }}</h3>
              </v-card-subtitle>
              <v-dialog transition="dialog-top-transition" max-width="600">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text color="error" v-bind="attrs" v-on="on">
                    <h1>Rent</h1>
                  </v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="light" dark
                      >Opening from the top</v-toolbar
                    >
                    <v-card-text>
                      <v-row class="mt-2">
                        <v-col cols="12" md="3">
                          ID Room
                          <v-text-field
                            :v-model="(id = room.idRoom)"
                            :label="room.idRoom"
                            prepend-icon="mdi-home"
                            solo
                            disabled
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          Check In
                          <v-menu
                            v-model="menu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="date"
                                prepend-icon="mdi-calendar"
                                solo
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date"
                              :allowed-dates="disableDay"
                              @input="menu = false"
                              min="2016-06-01"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" md="3">
                          Many days
                          <v-select
                            :items="chooseDay"
                            v-model="day"
                            label="day"
                            prepend-icon="mdi-calendar"
                            solo
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                          Price
                          <v-text-field
                            :v-model="(allPrice = room.price * day)"
                            :label="allPrice + ` ฿`"
                            prepend-icon="mdi-cash"
                            solo
                            disabled
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn text @click="rent">rent</v-btn>
                      <v-btn text @click="dialog.value = false">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-card>
          </v-hover>
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
    id: 0,
    user: null,
    dataList: [],
    sheet: false,
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    chooseDay: [1, 2, 3, 4, 5],
    day: 0,
    allPrice: 0
  }),
  beforeCreate() {
    auth.onAuthStateChanged(user => {
      if (user != null) {
        this.user = user.email;
        console.log(this.user);
      } else {
        console.log(this.user);
        this.$router.replace("/cLog");
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
      db.collection("room")
        .where("status", "==", true)
        .orderBy("idRoom")
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            console.log(doc.id);
            this.dataList.push(doc.data());
          });
        });
    },
    rent() {
      if (this.day != 0) {
        const data = {
          cusEmail: this.user,
          idRoom: this.id,
          checkIn: this.date,
          stayIn: this.day,
          price: this.allPrice,
          status: "Waiting to check"
        };
        db.collection("rentRoom")
          .doc(this.id.toString() + "_" + this.user)
          .set(data)
          .then(() => {
            console.log("Document successfully written!");
            alert("Reserve Success");
          })
          .catch(error => {
            console.log("Error writing document: ", error);
          });
      } else {
        alert("Pls, choose any day! Greater than 1 day");
      }
    },
    disableDay(value) {
      return value >= new Date().toISOString();
    }
  }
};
</script>
