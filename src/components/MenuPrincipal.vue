<template>
  <div>
    <div class="btnback ml-4 mt-2">
      <b-button-group>
          <b-button
            size="lg" 
            variant="success"
            v-if="!inicio"
            v-b-tooltip.hover title="Inicio"
            @click="voltarInicio">
            <b-icon icon="house-door" aria-label="Inicio"></b-icon>
          </b-button>         
        </b-button-group>   
    </div>

    <div class="menus">
      <b-card
        v-for="card in cards"        
        style="background-color: #4caf50"
        text-variant="white"
        class="text-center ml-4 mt-2 grow"
        :key="card.titulo"
        :header="card.titulo"
        @click="cardSelecionado(card)">
        <b-card-img
          :src="require('../assets/' + card.nomeImg)"
          width="65"
          height="65">
        </b-card-img>        
      </b-card>
    </div>

    <modal name="modais">
      <component :is="componente">
      </component>
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
      inicio: true,
      componente: 'Feriados',
      lancamento:false
    };
  },
  created() {
    this.cardsAtuais = this.cards
  },
  methods: {
    cardSelecionado(card) {
      if(!card.popup)
        this.$emit("tituloSelecionado", card.titulo, card.icon);

      this.$emit('iconSelecionado', card.icon)
        
      this.inicio = false;
      
      if(card.filhos)
        this.cards = card.filhos

      if(card.possuiRota)
      {
        this.$router.push(card.rota)
        this.lancamento = true
      }
    
      this.componente = card.componente
      this.showModal(card.popup)
    },
    voltarInicio() {
      this.inicio = true
      this.lancamento = false
      this.cards = this.cardsAtuais
      this.$emit("tituloSelecionado", 'PRINCIPAL');
      this.$emit('iconSelecionado', 'house-door')

    },
    showModal(popup) {
      const componente = this.componente == 'Vendedores' ? Vendedores : 
      this.componente == 'Feriados' ? Feriados : '';
      
      popup && this.$modal.show(componente)
    }
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