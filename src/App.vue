<template>
  <div id="app" class="container1 grid-areas">
    <div class="header">
      <Header :titulo="titulo" :icon="icon" />
    </div>

    <div class="body">
      <router-view/>    
    </div>

    <div class="footer">
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
      icon: 'house-door'
    };
  },
  methods: {
   
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html,
body {
  width: 100%;
  height: 100vh;
}
.container1 {
  display: grid;
  grid-template-rows: 12% auto 10%;
  grid-template-columns: 50% 50%;
  width: 100%;
  height: 100vh;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  width: 100%;
  height: 100%;
  color: #fff;
  background: #4caf50;
  grid-area: header;
}
.body {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  width: 100%;
  height: 100%;
  grid-area: body;
}
.footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #4caf50;
  grid-area: footer;
}

.grid-areas {
  grid-template-areas:
    "header header"
    "body body" "footer footer";
}
</style>
