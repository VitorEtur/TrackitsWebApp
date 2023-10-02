<template>
    <v-app-bar app>
      <v-toolbar-title>TRACKITS</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Pesquisar"
        single-line
        hide-details
      ></v-text-field>

      
    </v-app-bar>
  </template>
  
  <script>
  export default {
    data() {
      return {
        search: '', // Utilize essa variável para armazenar o valor da pesquisa
      };
    },
  };
  </script>
  