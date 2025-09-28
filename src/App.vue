<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

  </header>

</template>

<script lang="ts">
  import axios from "axios";
  import REQUEST_PARAMS from "./request_params.ts";

export default {
  name: "App",
  data() {
    return {
      wxData: null,
    };
  },
  mounted() {
    this.getWxData();
    console.log(REQUEST_PARAMS)
  },
  methods: {
    async getWxData() {
      try {
        const response = await axios(REQUEST_PARAMS);
        console.log(response)
        //this.weatherData = response.data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
