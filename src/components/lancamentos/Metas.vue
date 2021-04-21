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
          @click="voltarInicio('/')"
        >
          <b-icon icon="house-door" aria-label="Inicio"></b-icon>
        </b-button>
        <b-button
          size="lg"
          variant="primary"
          v-if="inicio"
          v-b-tooltip.hover
          title="Lançamentos"
          @click="voltarInicio('lancamentos')"
        >
          <b-icon icon="arrow-left-circle" aria-label="Inicio"></b-icon>
        </b-button>

        <b-button
          size="lg"
          variant="outline-primary"
          v-b-modal.lancamento
          v-b-tooltip.hover
          title="Inserir Lançamento"
        >
          <b-icon icon="plus-circle"></b-icon>
        </b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inicio: true,
    };
  },
  methods: {
    voltarInicio(rota) {
      this.$router.push(`${rota}`);
    },
  },
};
</script>

<style>
</style>