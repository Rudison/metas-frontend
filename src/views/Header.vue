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
/* .header {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 100%;
  background: #4caf50;
  color: #fff;
  font-size: 1.5rem;
  background: #4caf50;
  border: 1px solid #4caf50;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
} */
</style>