<template>
  <div id="app" class="container1">
    <div class="headerArea">
      <Header :titulo="titulo" :icon="icon" />
    </div>

    <div class="body">
      <router-view />
    </div>

    <div class="footerArea">
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "./views/Header";
import Footer from "./views/Footer";

export default {
  name: "App",
  components: { Header, Footer },
  data() {
    return {
      titulo: "PRINCIPAL",
      icon: "house-door",
    };
  },
  methods: {},
};
</script>

<style>
html,
body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.container1 {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  grid-template-areas: "headerArea" "bodyArea" "footerArea";
  grid-template-rows: 60px 1fr 60px;
}
.headerArea {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  width: 100%;
  height: 60px;
  color: #fff;
  background: #4caf50;
  grid-area: headerArea;
}
.bodyArea {
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  grid-area: bodyArea;
}
.footerArea {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  background: #4caf50;
  grid-area: footerArea;
}
/* .grid-areas {
  grid-template-areas:
    "headerArea"
    "bodyArea" "footerArea";
} */
</style>
