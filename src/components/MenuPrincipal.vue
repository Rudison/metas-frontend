<template>
  <div>
    <b-button
      v-if="!rotaPrincipal"
      pill
      variant="outline-success"
      class="btnback"
      @click="voltarInicio"
    >
      <img src="../assets/iconHome.svg" alt="" />
    </b-button>
    <div class="menus">
      <b-card
        v-for="card in cards"
        :key="card.titulo"
        bg-variant="success"
        text-variant="white"
        :header="card.titulo"
        class="text-center ml-3 mt-2 mr-3 grow"
        @click="cardSelecionado(card)"
      >
        <b-card-img
          :src="require('../assets/' + card.nomeImg)"
          width="65"
          height="65"
        ></b-card-img>
      </b-card>
    </div>
  </div>
</template>

<script>
import cards from "../menus";

export default {
  data() {
    return {
      cards,
      rotaPrincipal: true,
    };
  },
  methods: {
    cardSelecionado(card) {
      this.$emit("tituloSelecionado", card.titulo);
      this.rotaPrincipal = false;
    },
    voltarInicio() {},
  },
};
</script>

<style scoped>
.btnback {
  float: left;
}
.menus {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.card {
  width: 200px;
  height: 200px;
  cursor: pointer;
  margin-bottom: 10px;
}

.grow {
  transition: all 0.2s ease-in-out;
}
.grow:hover {
  transform: scale(1.1);
}
</style>