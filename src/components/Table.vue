<template>
    
    <v-app>
      <!-- <v-toolbar app color="primary">
        <v-toolbar-title>RASTREIO - SIGEP</v-toolbar-title>
      </v-toolbar> -->
  
      <v-content>
        <v-container>
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
                    <!-- <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular> -->
                  </v-col>
                  
                </v-row>
              </v-form>

              <!-- <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular> -->

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

              <v-data-table
                :headers="headers"
                :items="data"
                item-key="destinatario"
                :pagination.sync="pagination"
              >
                <template v-slot:item.link="{ item }">
                  <a :href="item.link" target="_blank">{{ item.link }}</a>
                  <v-icon @click="copiarLink(item.link)" class="copy-icon">mdi-content-copy</v-icon>
                </template>
                
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>

          <v-table>
            <thead>
              <tr>
                <th class="text-left">DESTINATÁRIO</th>
                <th class="text-left">LINK</th>
                <th class="text-left">CARTEIRINHA</th>
                <th class="text-left">OBS</th>
                <th class="text-left">DATA DE CRIAÇÃO</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data" :key="`item-${index}`">
                <td>{{  item.destinatario }}</td>
                <td>{{  item.link }}</td>
                <td>{{  item.carteirinha }}</td>
                <td>{{  item.obs }}</td>
                <td>{{  item.dataCriacao }}</td>
              </tr>
            </tbody>
          </v-table>

      </v-content>
  
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
    </v-app>
    
  </template>
  
  <script>
  export default {
    data() {
      return {
        campoPesquisa: '',
        headers: [
          { text: 'DESTINATÁRIO', value: 'destinatario' },
          { text: 'LINK', value: 'link' },
          { text: 'CARTEIRINHA', value: 'carteirinha' },
          { text: 'OBS', value: 'obs' },
          { text: 'DATA DE CRIAÇÃO', value: 'dataCriacao' },
        ],
        data: [],
        resultadoPesquisa: 'Pesquise para mostrar informações',
        isLoading: false,
        ordemCrescente: true,
        
        pagination: {
          itemsPerPage: 50,
          itemsPerPageOptions: [10, 20, 30, 50, 100, -1],
        },
      };
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
            
            this.data = searchData.map((row) => ({
              destinatario: row[0],
              link: row[1],
              carteirinha: row[2],
              obs: row[3],
              dataCriacao: row[4],
            }));
  
            this.resultadoPesquisa = `Códigos encontrados: ${searchData.length}`;

            this.pagination.totalItems = this.data.length;

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
        this.data.reverse();
        this.ordemCrescente = !this.ordemCrescente;
      },
      voltarAoTopo() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
  };
  
  </script>
  
  <style scoped>

  .btn-topo {
    position: fixed;
    background-color: #7a26f094;
    bottom: 0;
    right: 0;
    margin: 0 1rem 1rem 0;
  }

  .btn-topo:hover {
    position: fixed;
    background-color: #7926f0;
    color: white;
  }
  </style>
  
  