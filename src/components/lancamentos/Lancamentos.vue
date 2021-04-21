<template>
  <div>
    <div class="btnback ml-2">
      <b-button-group>
        <b-button
          size="lg"
          variant="success"
          v-if="inicio"
          v-b-tooltip.hover
          title="Inicio"
          @click="voltarInicio"
        >
          <b-icon icon="house-door" aria-label="Inicio"></b-icon>
        </b-button>

        <b-button
          size="lg"
          variant="primary"
          v-b-modal.lancamento
          v-b-tooltip.hover
          title="Inserir Lançamento"
        >
          <b-icon icon="plus-circle"></b-icon>
        </b-button>
        <b-button
          size="lg"
          variant="outline-info"
          v-b-modal.modalAno
          v-b-tooltip.hover
          title="Filtrar Por Ano"
        >
          <b-icon icon="search"></b-icon>
        </b-button>
      </b-button-group>
    </div>

    <b-modal id="modalAno" size="sm" title="Ano do Lançamento" hide-footer>
      <b-container>
        <b-form>
          <b-form-group id="label1" label="Ano" label-for="campo1">
            <b-form-input id="campo1" v-model.trim="ano"></b-form-input>
          </b-form-group>

          <b-button
            type="submit"
            variant="success"
            class="mr-2"
            @click.prevent="listar"
            >Filtrar</b-button
          >
          <b-button class="mr-2" @click="fecharModal">Fechar</b-button>
        </b-form>
      </b-container>
    </b-modal>

    <div class="menus">
      <b-card
        class="ml-3"
        style="background-color: #4caf50; max-width: 20rem"
        v-for="lancamento in lancamentos"
        :key="lancamento.id"
        no-body
        @click.stop="cardSelecionado(lancamento)"
      >
        <template #header>
          <h4 class="mb-0 tituloMes">{{ lancamento.Mes }}</h4>
        </template>

        <b-list-group flush>
          <b-list-group-item>
            <div class="titulosValores">Valor Mensal</div>
            {{ lancamento.valorMetaMensal }}
            <div class="titulosValores">Valor Realizado</div>
            {{ lancamento.valorMetaRealizadoMensal }}
          </b-list-group-item>

          <b-list-group-item v-if="info">
            <div class="titulosValores">
              Semanas no Mês : {{ lancamento.semanasNoMes }}
            </div>
            <div class="titulosValores">
              Dias Uteis no Mês : {{ lancamento.diasUteisMes }}
            </div>
          </b-list-group-item>
        </b-list-group>

        <b-card-footer class="footerCard">
          <b-icon
            class="mr-2"
            :variant="lancamento.percentual >= 100 ? 'light' : 'danger'"
            :icon="
              lancamento.percentual >= 100
                ? 'arrow-up-circle'
                : 'arrow-down-circle'
            "
          ></b-icon>
          {{ lancamento.percentual }}%
          <b-button
            variant="outline-light"
            class="ml-2"
            size="sm"
            @click.prevent.stop="info = !info"
            >Info</b-button
          >
        </b-card-footer>
      </b-card>

      <!-- <b-card
        v-for="lancamento in lancamentos"
        :key="lancamento.id"
        style="background-color: #4caf50"
        text-variant="white"
        class="text-center ml-4 mt-2 grow"
        :header="lancamento.mes"
      >
        {{ lancamento.id }}
      </b-card> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { baseApiUrl } from "@/global";

export default {
  name: "Lancamentos",
  mounted() {
    this.listar();
  },
  data() {
    return {
      ano: new Date().getFullYear(),
      inicio: true,
      lancamentos: [],
      info: false,
    };
  },
  methods: {
    voltarInicio() {
      this.$router.push("/");
    },
    listar() {
      axios
        .get(`${baseApiUrl}/metas/porAno/${this.ano}`)
        .then((res) => {
          this.lancamentos = res.data;
        })
        .catch((error) => {
          console.log(error);
        });

      this.fecharModal();
    },
    cardSelecionado(lancamento) {
      this.$router.push("/metas");
    },
    fecharModal() {
      this.$bvModal.hide("modalAno");
    },
  },
};
</script>

<style>
.tituloMes {
  font-size: 1.3rem;
  color: #fff;
  font-weight: bold;
}
.titulosValores {
  color: #4caf50;
  font-size: 1.1rem;
  font-weight: bold;
}
.btnback {
  float: left;
}
.menus {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.card {
  cursor: pointer;
}
.footerCard {
  color: #fff;
  font-size: 1.3rem;
  font-weight: bold;
}
</style>