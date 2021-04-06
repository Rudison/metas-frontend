<template>
  <div id="app" class="container1 grid-areas">
    <div class="header">
      <Header :titulo="paramTitulo" />
    </div>

    <div class="body">
      <MenuPrincipal @tituloSelecionado="titulo = $event" />

      <button @click="showModalFeriados">modal</button>

      <modal name="modalFeriados">
        <Feriados />
      </modal>
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "./views/Header";
import MenuPrincipal from "./components/MenuPrincipal";
import Footer from "./views/Footer";
import Feriados from "./components/cadastros/Feriados";

export default {
  name: "App",
  components: { Header, MenuPrincipal, Feriados, Footer },
  data() {
    return {
      titulo: "PRINCIPAL",
    };
  },
  computed: {
    paramTitulo() {
      return this.titulo;
    },
  },
  methods: {
    showModalFeriados() {
      this.$modal.show(Feriados, {
        buttons: [
          {
            title: "Cancel",
            handler: () => {
              this.$modal.hide("dialog");
            },
          },
          {
            title: "Like",
            handler: () => {
              alert("Like action");
            },
          },
          {
            title: "Repost",
            handler: () => {
              alert("Repost action");
            },
          },
        ],
      });
    },
    hideModalFeriados() {
      this.$modal.hide("modalFeriados");
    },
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
