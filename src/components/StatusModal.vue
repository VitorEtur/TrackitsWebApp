<template>
    <v-dialog v-model="modalIsOpen" activator="parent" max-width="600px">
      <v-card>
        <v-card-title>
          <v-btn icon @click="closeStatusModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <h1>STATUS DO PEDIDO</h1>
          <!-- Conteúdo do modal -->
          <!-- ... -->
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      modalIsOpen: Boolean,
    },
    methods: {
      closeStatusModal() {
        this.$emit('fechar-modal'); // Emitir um evento personalizado 'fechar-modal'
      },
    },
  };
  </script>
  