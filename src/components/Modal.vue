<template>
  <modal name="meuModalTemplate">
    <button>teste</button>
    aaaaaaaaaaaaaaaaaaaaa
  </modal>
</template>

<script>
import Vendedores from "./cadastros/Vendedores";

export default {
  name: "meuModalTemplate",
  methods: {
    showModal() {
      this.$modal.show(Vendedores, { text: "Passado via Propridade" });
    },
    hideModa() {
      this.$modal.hide("meuModalTemplate");
    },
  },
};
</script>

<style>
</style>