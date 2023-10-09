<template>
  <v-form @submit.prevent="pesquisarLotes">
    <v-row>
      <v-col cols="12" class="mt-4">
        <v-text-field
          v-model="campoPesquisa"
          hide-details
          label="NOME OU NÚMERO DA CARTEIRINHA"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" :loading="isLoading" type="submit">Pesquisar</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      campoPesquisa: '',
      isLoading: false,
    };
  },
  methods: {
    pesquisarLotes() {
      this.isLoading = true;
      // Emitir um evento personalizado 'pesquisar' com o valor de campoPesquisa
      this.$emit('pesquisar', this.campoPesquisa);
    },
  },
};
</script>
