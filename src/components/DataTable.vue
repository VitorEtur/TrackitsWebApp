<template>
    <v-data-table
      class="v-data-footer"
      v-if="mostrarTabela"
      :headers="headers"
      :items="displayedData"
      item-value="destinatario"
      item-key="destinatario"
      :pagination.sync="pagination"
      :virtual-items="virtualItems"
    >
      <!-- ... seu código de coluna e outras partes da tabela -->
    </v-data-table>
  </template>
  
  <script>
  import SearchForm from './SearchForm.vue';
  import StatusModal from './StatusModal.vue';
  
  export default {
    props: {
      // ... suas outras props
    },
    components: {
      SearchForm,
      StatusModal,
    },
    methods: {
      // ... seus outros métodos
  
      // Método para abrir o modal de status
      showStatusModal(item) {
        // Emitir um evento personalizado 'abrir-modal' com o item atual
        this.$emit('abrir-modal', item);
      },
    },
  };
  </script>
  