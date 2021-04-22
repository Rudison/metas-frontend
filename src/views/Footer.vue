<template>
  <div class="footer">METAS CASTELO {{ dataAtual }}</div>
</template>

<script>
export default {
  data() {
    return {
      dataAtual: new Date().getFullYear(),
    };
  },
};
</script>

<style>
.footer {
  color: #fff;
  background-color: #4caf50;
}
</style>