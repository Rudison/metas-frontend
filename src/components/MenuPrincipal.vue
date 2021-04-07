<template>
  <div>
    <b-button
      v-if="!rotaPrincipal"
      pill
      variant="outline-success"
      class="btnback"
      @click="voltarInicio">
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
        @click="cardSelecionado(card)">
        <b-card-img
          :src="require('../assets/' + card.nomeImg)"
          width="65"
          height="65"
        ></b-card-img>
      </b-card>
    </div>

    <modal name="modalFeriados">
      <Feriados />
    </modal>

    <modal name="modalVendedores">
      <Vendedores />
    </modal>
  </div>
</template>

<script>
import cards from "../menus";
import Feriados from "./cadastros/Feriados";
import Vendedores from "./cadastros/Vendedores";

export default {
  components:{ Feriados, Vendedores },
  data() {
    return {
      cards,
      cardsAtuais: [],
      rotaPrincipal: true,
    };
  },
  created() {
    this.cardsAtuais = this.cards
  },
  methods: {
    cardSelecionado(card) {
      this.$emit("tituloSelecionado", card.titulo);
      this.rotaPrincipal = false;
      
      if(card.filhos)
        this.cards = card.filhos
      
      if(card.popup && card.nome == 'vendedor')
        this.showModalVendedores()

      if(card.popup && card.nome == 'feriado')
        this.showModalFeriados()
    },
    voltarInicio() {
      this.rotaPrincipal = true
      this.cards = this.cardsAtuais
    },
     showModalFeriados() {
      this.$modal.show(Feriados);
    },
    hideModalFeriados() {
      this.$modal.hide(Feriados);
    },
    showModalVendedores() {
      this.$modal.show(Vendedores);
    },
    hideModalVendedores() {
      this.$modal.hide(Vendedores);
    },
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