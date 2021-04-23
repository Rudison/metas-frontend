<template>
  <div><b-icon :icon="icon" aria-label="Inicio"></b-icon> {{ titulo }}</div>
</template>

<script>
export default {
  props: {
    titulo: {
      type: String,
      required: true,
      default: "PRINCIPAL",
    },
    icon: String,
  },
  data() {
    return {};
  },
};
</script>

<style>
</style>