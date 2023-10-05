<template>
    <v-btn
      id="btnTopo"
      class="btn-topo"
      @click="voltarAoTopo"
      fab
      bottom
      right
      dark
      fixed
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </template>
  
  <script>
  export default {
    data() {
      return {
        voltarAoTopo() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        };
    },
  };
  </script>
  
  <style scoped>
.btn-topo {
  position: fixed;
  background-color: #7a26f056;
  bottom: 0;
  right: 0;
  margin: 0 5rem 5rem 0;
}
.btn-topo:hover {
  background-color: #7926f0;
  color: white;
}
</style>