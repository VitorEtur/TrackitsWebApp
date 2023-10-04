<template>

  <v-app>

    <v-container>

      <v-main>

        <v-row>
          <v-col cols="12" class="text-center">
            <h1 class="mt-4">CONSULTA CÓDIGO DE RASTREIO</h1>
            <v-form @submit.prevent="pesquisarLotes">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="campoPesquisa" label="NOME OU NÚMERO DA CARTEIRINHA"></v-text-field>
                </v-col>
                <v-col cols="12" sm="0">
                  <v-btn color="primary" :loading="isLoading" @click="pesquisarLotes">Pesquisar</v-btn>
                </v-col>
              </v-row>
            </v-form>
            <p id="resultadoPesquisa">{{ resultadoPesquisa }}</p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn @click="inverterLista">{{ ordemCrescente ? '▲ Mais recentes ▲' : '▼ Mais antigos ▼' }}</v-btn>
          </v-col>
        </v-row>

        

        <v-row>
          <v-col cols="12">

            <!-- <v-row>
              <v-col cols="12">
                <v-select v-model="pagination.itemsPerPage" :items="itemsPerPageOptions" label="Items per page"
                @input="updateCurrentPage">
                </v-select>
              </v-col>
            </v-row> -->
            

            <!-- <v-table>
              <thead>
                <tr>
                  <th class="text-center">DESTINATÁRIO</th>
                  <th class="text-center">LINK</th>
                  <th class="text-center">CARTEIRINHA</th>
                  <th class="text-center">OBS</th>
                  <th class="text-center">DATA DE CRIAÇÃO</th>
                </tr>
             </thead>
            </v-table> -->

            <v-data-table
              :headers="headers"
              :items="displayedData"
              item-value="destinatario"
              item-key="destinatario"
              :pagination.sync="pagination"
              :virtual-items="virtualItems"
            >
            
              <template v-slot:item.link="{ item }">
                <a :href="item.link" target="_blank">{{ item.link }}</a>
                <v-icon @click="copiarLink(item.link)" class="copy-icon">mdi-content-copy</v-icon>
              </template>
              
            </v-data-table>

          </v-col>
        </v-row>

      </v-main>

      <!-- <v-table>

        <thead>
          <tr>
            <th class="text-center">DESTINATÁRIO</th>
            <th class="text-center">LINK</th>
            <th class="text-center">CARTEIRINHA</th>
            <th class="text-center">OBS</th>
            <th class="text-center">DATA DE CRIAÇÃO</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in data" :key="`item-${index}`">
            <td class="text-center">{{  item.destinatario }}</td>
            <td class="text-center">{{  item.link }}</td>
            <td class="text-center">{{  item.carteirinha }}</td>
            <td class="text-center">{{  item.obs }}</td>
            <td class="text-center">{{  item.dataCriacao }}</td>
          </tr>
        </tbody>
      </v-table> -->

    </v-container>

  </v-app>

</template>

<script>
export default {
  data() {
    return {
      
      campoPesquisa: '',
      filteredData: [],

      headers: [
        { title: 'DESTINATÁRIO', value: 'destinatario', align: 'center', sortable: false },
        { title: 'LINK', value: 'link', align: 'center', sortable: false },
        { title: 'CARTEIRINHA', value: 'carteirinha', align: 'center', sortable: false },
        { title: 'OBS', value: 'obs', align: 'center', sortable: false },
        { title: 'DATA DE CRIAÇÃO', value: 'dataCriacao', align: 'center', sortable: false },
      ],

      data: [],
      resultadoPesquisa: 'Pesquise para mostrar informações',
      isLoading: false,
      ordemCrescente: true,
      pagination: {
        itemsPerPage: 9999,
        page: 1,
        totalItems: 0,
      },

    };
  },
  computed: {
    displayedData() {
      const start = (this.pagination.page - 1) * this.pagination.itemsPerPage;
      const end = start + this.pagination.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
  },
  methods: {

    pesquisarLotes() {
      this.isLoading = true;
      var spreadsheetId = '1VJnxR5diGZzvW-MZhWBNYsSOBQvuDFePGe_cGhq45FU';
      // Chave da API do Google Sheets
      var apiKey = 'AIzaSyDgWHhVhuLRFM3bBaNyKmsQylaqoOqYPQk';
      // Intervalo de células para importar (por exemplo, 'Sheet1!A1:C10')
      var range = 'RASTREIO!A2:E999999';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const rows = data.values || [];
          const searchData = rows.filter((row) =>
            row.some((value) => value.toLowerCase().includes(this.campoPesquisa.toLowerCase()))
          );
          this.filteredData = searchData.map((row) => ({
            destinatario: row[0],
            link: row[1],
            carteirinha: row[2],
            obs: row[3],
            dataCriacao: row[4],
          }));
          this.resultadoPesquisa = `Códigos encontrados: ${searchData.length}`;
          this.filteredData.reverse();
          this.pagination.totalItems = this.filteredData.length;
        })
        .catch((error) => {
          console.error('Ocorreu um erro ao pesquisar os lotes:', error);
          this.resultadoPesquisa = 'Ocorreu um erro ao pesquisar os lotes.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },


    copiarLink(link) {
      const textoCopiado = `Segue o código de rastreio: ${link}`;
      navigator.clipboard.writeText(textoCopiado)
        .then(() => {
          alert(`Texto copiado para a área de transferência: ${textoCopiado}`);
        })
        .catch((error) => {
          console.error('Ocorreu um erro ao copiar o texto:', error);
        });
    },


    inverterLista() {
      this.filteredData.reverse();
      this.ordemCrescente = !this.ordemCrescente;
    },

    updateCurrentPage() {
      this.pagination.page = 1;
    },

  },
};
</script>

<style scoped>

</style>
