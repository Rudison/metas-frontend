<template>
  <div>
    <div class="btnback ml-2">
      <b-button-group vertical>
        <b-button
          size="xl"
          variant="success"
          v-if="inicio"
          v-b-tooltip.hover
          title="Inicio"
          @click="voltarInicio('/')"
        >
          <b-icon icon="house-door" aria-label="Inicio"></b-icon>
        </b-button>
        <b-button
          size="xl"
          variant="primary"
          v-if="inicio"
          v-b-tooltip.hover
          title="Lançamentos"
          @click="voltarInicio('/lancamentos')"
        >
          <b-icon icon="arrow-left-circle" aria-label="Inicio"></b-icon>
        </b-button>

        <b-button
          size="xl"
          variant="outline-primary"
          v-b-tooltip.hover
          @click="abrirModalVendMes"
          title="Inserir Meta Mês Vendedor"
        >
          <b-icon icon="people-fill"></b-icon>
        </b-button>

        <b-button
          size="xl"
          variant="outline-primary"
          @click="abrirModalSemana"
          v-b-tooltip.hover
          v-if="qtdMetasVendMes > 0"
          title="Inserir Semana"
        >
          <b-icon icon="calendar2-date"></b-icon>
        </b-button>
      </b-button-group>
    </div>

    <div class="titulo">
      <b-alert
        variant="success"
        style="box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.25)"
        show
        >META - {{ meta.Mes }}</b-alert
      >
    </div>

    <CardsMetasSemana :metaId="metaId" :meta="meta" :mes="meta.Mes" />

    <b-modal
      id="modalMetaSemana"
      :title="`Metas da Semana - ${meta.Mes}`"
      header-bg-variant="success"
      header-text-variant="light"
      no-close-on-esc
      hide-footer
    >
      <MetasSemana :metaId="metaId" :fecharModalSem="fecharModalSemana" />
    </b-modal>

    <b-modal
      id="modalMetaVendMes"
      header-bg-variant="success"
      header-text-variant="light"
      :title="`Metas Vendedores Mensal - ${meta.Mes}`"
      no-close-on-esc
      hide-footer
    >
      <MetasVendedorMes
        :metaId="metaId"
        @metasVendedores="qtdMetasVendMes = $event"
      />
    </b-modal>
  </div>
</template>

<script>
import MetasSemana from "./MetasSemana";
import MetasVendedorMes from "./MetasVendedorMes";
import CardsMetasSemana from "./CardsMetasSemana";

import axios from "axios";
// import { baseApiUrl } from "@/global";
import { baseApiUrl } from "../../global";

export default {
  props: {
    metaId: { type: String },
    meta: { type: Object },
  },
  components: { MetasSemana, MetasVendedorMes, CardsMetasSemana },
  data() {
    return {
      inicio: true,
      qtdMetasVendMes: 0,
    };
  },
  mounted() {
    this.listarMetasVendMes();
  },
  methods: {
    listarMetasVendMes() {
      axios
        .get(`${baseApiUrl}/metasVendedorMes/vendedorMetaSelect/${this.metaId}`)
        .then((res) => {
          this.qtdMetasVendMes = res.data.length;
        });
    },
    voltarInicio(rota) {
      this.$router.push(`${rota}`);
    },
    abrirModalVendMes() {
      this.$bvModal.show("modalMetaVendMes");
    },
    abrirModalSemana() {
      this.$bvModal.show("modalMetaSemana");
    },
    fecharModalSemana() {
      this.$bvModal.hide("modalMetaSemana");
    },
  },
};
</script>
<style scoped>
.titulo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
}
</style>