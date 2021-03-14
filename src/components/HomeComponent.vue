<template v-slot:placeholder>
  <div id="HomeComponent">
    <v-parallax
      dark
      transition="slide-x-transition"
      src="https://cutewallpaper.org/21/black-gif-background/Black-gif-background-3-GIF-Images-Download.gif"
      height="653"
      width="auto"
      fixed
    >
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="display-1 subheading mb-4 hotal-title ">
            <div class="v-enter-active" v-if="!isloaded">
              Welcome
            </div>
          </h1>
          <h3 class="font-weight-thin hotal-title">
            <span>
              <div class="v-enter-active" v-if="!isloaded">
                to Impossible Hotel
              </div>
            </span>
          </h3>
          <div class="text-center v-enter-active" v-if="!isloaded">
            <v-btn class="ma-2" outlined color="yellow" to="/about">
              Visit My Site
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-parallax>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: () => {
        return {
          isloaded: false
        };
      },
      mounted() {
        document.onreadystatechange = () => {
          if (document.readyState == "complete") {
            this.isloaded = true;
          }
        };
      }
    };
  }
};
</script>
