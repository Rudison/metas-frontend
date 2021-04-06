<template>
  <div class="footer">
    <p>METAS CASTELO {{ dataAtual }}</p>
  </div>
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
  height: 60px;
  color: #fff;
  background-color: #4caf50;
}
</style>