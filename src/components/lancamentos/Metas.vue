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
          title="Inserir Semana"
        >
          <b-icon icon="calendar2-date"></b-icon>
        </b-button>
      </b-button-group>
    </div>

    <CardsMetasSemana :metaId="metaId" />

    <b-modal
      id="modalMetaSemana"
      :title="`Metas da Semana - ${mesAnoMeta}`"
      hide-footer
    >
      <MetasSemana :metaId="metaId" :fecharModalSem="fecharModalSemana" />
    </b-modal>

    <b-modal
      id="modalMetaVendMes"
      :title="`Metas Vendedores Mensal - ${mesAnoMeta}`"
      hide-footer
    >
      <MetasVendedorMes :metaId="metaId" />
    </b-modal>
  </div>
</template>

<script>
import MetasSemana from "./MetasSemana";
import MetasVendedorMes from "./MetasVendedorMes";
import CardsMetasSemana from "./CardsMetasSemana";

export default {
  props: ["metaId"],
  components: { MetasSemana, MetasVendedorMes, CardsMetasSemana },
  data() {
    return {
      inicio: true,
      mesAnoMeta: "JAN/2021",
    };
  },
  methods: {
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

<style>
</style>