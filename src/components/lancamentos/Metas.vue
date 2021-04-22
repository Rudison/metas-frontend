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
          v-b-modal.lancamento
          v-b-tooltip.hover
          title="Inserir Semana"
        >
          <b-icon icon="calendar2-date"></b-icon>
        </b-button>
      </b-button-group>
    </div>

    <b-modal
      id="modalMetaVendMes"
      :title="`Metas Vendedores Mensal - ${mesAnoMeta}`"
      hide-footer
    >
      <MetasVendedorMes :metaId="metaId" />
    </b-modal>

    <strong>Código: {{ metaId }}</strong>
  </div>
</template>

<script>
import MetasVendedorMes from "./MetasVendedorMes";

export default {
  props: ["metaId"],
  components: { MetasVendedorMes },
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
  },
};
</script>

<style>
</style>