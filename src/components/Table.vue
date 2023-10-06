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
                  <v-text-field
                    v-model="campoPesquisa"
                    label="NOME OU NÚMERO DA CARTEIRINHA"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="0">
                  <v-btn
                    color="primary"
                    :loading="isLoading"
                    @click="pesquisarLotes"
                    >Pesquisar</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
            <p id="resultadoPesquisa">{{ resultadoPesquisa }}</p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn @click="inverterLista"
              >{{ ordemCrescente ? '▲ Mais recentes ▲' : '▼ Mais antigos ▼'
              }}</v-btn
            >
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
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
                <v-icon @click="copiarLink(item.link)" class="copy-icon"
                  >mdi-content-copy</v-icon
                >
                <v-icon
                  @click="showStatusModal(item)"
                  class="expand-icon"
                  :class="{ 'expanded': expanded.includes(item) }"
                  >mdi-map-search</v-icon
                >

                <!-- <v-btn @click="showStatusModal(item)">Ver Status de Rastreamento</v-btn> -->

                <template>
                  <v-dialog 
                      v-model="modalIsOpen" 
                      activator="parent"
                      max-width="auto"
                      >
                        <v-card>
                          <v-card-title>
                            Status de Rastreamento
                            <v-spacer></v-spacer>
                            <v-btn icon @click="closeStatusModal">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </v-card-title>
                          <v-card-text>
                            <!-- Conteúdo do modal -->
                            <h1>STATUS DO PEDIDO</h1>

                            <v-list v-if="currentItem && currentItem.eventos.length > 0">
                              <v-list-item v-for="(evento, index) in currentItem.eventos" :key="index">
                                <v-list-item-title>DATA: {{ evento.data }} - {{ evento.hora }}</v-list-item-title>
                                <v-list-item-subtitle>LOCAL: {{ evento.local }}</v-list-item-subtitle>

                                <v-list-item-subtitle v-bind:style="{ color: getEventColor(evento.status) }">STATUS: {{ evento.status }}</v-list-item-subtitle>

                                <v-list-item-subtitle v-for="(subStatus, subIndex) in evento.subStatus" :key="subIndex">
                                  {{ subStatus }}
                                </v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
                            <v-list v-else>
                              <v-list-item>
                                <v-list-item-title>Nenhum evento de rastreamento encontrado.</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                    </v-dialog>
                </template>
              </template>
              
              <!-- Modelo de expansão personalizado -->
              <!-- <template v-slot:expanded="{ item }">
                <v-card>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
                        <div>Destinatário: {{ item.destinatario }}</div>
                        <div>Data de Criação: {{ item.dataCriacao }}</div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template> -->



              <!-- <template v-slot:expanded="{ value, currentItem }">
                <template>
                  <div>
                    
                    <v-dialog 
                      v-model="modalIsOpen" 
                      activator="parent"
                      max-width="auto">
                        <v-card>
                          <v-card-title>
                            Status de Rastreamento
                            <v-spacer></v-spacer>
                            <v-btn icon @click="closeStatusModal">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </v-card-title>
                          <v-card-text>
                            Conteúdo do modal
                            <v-list v-if="currentItem && currentItem.eventos.length > 0">
                              <v-list-item v-for="(evento, index) in currentItem.eventos" :key="index">
                                <v-list-item-title>{{ evento.data }} - {{ evento.hora }}</v-list-item-title>
                                <v-list-item-subtitle>{{ evento.local }}</v-list-item-subtitle>
                                <v-list-item-subtitle>{{ evento.status }}</v-list-item-subtitle>
                                <v-list-item-subtitle v-for="(subStatus, subIndex) in evento.subStatus" :key="subIndex">
                                  {{ subStatus }}
                                </v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
                            <v-list v-else>
                              <v-list-item>
                                <v-list-item-title>Nenhum evento de rastreamento encontrado.</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                    </v-dialog>
                  </div>

                </template>
              </template> -->

              
            </v-data-table>
          </v-col>
        </v-row>
      </v-main>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      campoPesquisa: '',
      currentItem: null,
      filteredData: [],
      virtualItems: [],
      expanded: [],
      modalIsOpen: false,
      headers: [
        {
          title: 'DESTINATÁRIO',
          value: 'destinatario',
          align: 'center',
          sortable: false,
        },
        { title: 'LINK', value: 'link', align: 'center', sortable: false },
        {
          title: 'CARTEIRINHA',
          value: 'carteirinha',
          align: 'center',
          sortable: false,
        },
        { title: 'OBS', value: 'obs', align: 'center', sortable: false },
        {
          title: 'DATA DE CRIAÇÃO',
          value: 'dataCriacao',
          align: 'center',
          sortable: false,
        },
      ],
      resultadoPesquisa: 'Pesquise para mostrar informações',
      isLoading: false,
      ordemCrescente: true,
      pagination: {
        itemsPerPage: 9999,
        page: 1,
        totalItems: 0,
      },
      expandedItems: [],
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
      var apiKey = 'AIzaSyDgWHhVhuLRFM3bBaNyKmsQylaqoOqYPQk'; // Substitua pelo seu API Key
      // Intervalo de células para importar (por exemplo, 'Sheet1!A1:C10')
      var range = 'RASTREIO!A2:E999999';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const rows = data.values || [];
          const searchData = rows.filter(row =>
            row.some(value =>
              value.toLowerCase().includes(this.campoPesquisa.toLowerCase())
            )
          );
          this.filteredData = searchData.map(row => ({
            destinatario: row[0],
            link: row[1],
            carteirinha: row[2],
            obs: row[3],
            dataCriacao: row[4],
            eventos: [], // Inicializa a lista de eventos vazia para cada item
            showModal: false, // Adicione a propriedade showModal

          }));
          this.resultadoPesquisa = `Códigos encontrados: ${searchData.length}`;
          this.filteredData.reverse();
          this.pagination.totalItems = this.filteredData.length;
        })
        .catch(error => {
          console.error('Ocorreu um erro ao pesquisar os lotes:', error);
          this.resultadoPesquisa = 'Ocorreu um erro ao pesquisar os lotes.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    getEventColor(status) {
      if (status === 'Objeto postado') {
        return 'green';
      } else if (status === 'Objeto saiu para entrega ao remetente') {
        return 'blue';
      } else if (status === 'A entrega não pode ser efetuada - Endereço incorreto') {
        return 'red';
      } else if (status === 'Objeto entregue ao remetente') {
        return 'red';
      } else if (status === 'Objeto saiu para entrega ao destinatário') {
        return 'blue';
      } else {
        return ''; // Cor padrão
      }
    },

    copiarLink(link) {
      const textoCopiado = `Segue o código de rastreio: ${link}`;
      navigator.clipboard
        .writeText(textoCopiado)
        .then(() => {
          alert(`Texto copiado para a área de transferência: ${textoCopiado}`);
        })
        .catch(error => {
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

    showStatusModal(item) {
      console.log('Abrindo modal para:', item);
      item.showModal = true; // Defina showModal como true
      this.currentItem = item;
      this.modalIsOpen = true;
      // this.currentItem.showModal = true;
      if (!item.eventos || item.eventos.length === 0) {
        // Carregue os eventos de rastreamento quando abrir o modal
        this.loadRastreamento(item);
      }
    },

    closeStatusModal() {
      this.modalIsOpen = false;
      // this.currentItem.showModal = false; // Defina showModal como false
    },

    async loadRastreamento(item) {
      this.isLoading = true;
      try {
          // Use uma expressão regular para extrair o código de rastreio do link
          const regex = /\/([^/]+)\/?$/;
          const match = item.link.match(regex);
          if (match) {
            const codigoRastreio = match[1]; // O código de rastreio extraído

            const response = await axios.get(
              `https://api.linketrack.com/track/json?user=vitor.etur@gmail.com&token=965eefade2f5838dfd741d78e60e7dbaf2cc212a1db282035b66bf693fc2f500&codigo=${codigoRastreio}`
            );
            const data = response.data;

            if (data && data.eventos && data.eventos.length > 0) {
              item.eventos = data.eventos;
              console.log('Dados de rastreamento obtidos:', item.eventos);
            } else {
              item.eventos = [];
              console.warn('Nenhum dado de rastreamento encontrado.');
            }
          } else {
            console.error('Link de rastreamento inválido:', item.link);
            item.eventos = [];
          }
      } catch (error) {
        console.error('Erro ao buscar eventos de rastreamento:', error);
        item.eventos = [];
      } finally {
        this.isLoading = false;
        this.expandedItems.push(item);
      }
    },

    // async expandirLinha(item) {
    //   if (this.expandedItems.includes(item)) {
    //     const index = this.expandedItems.indexOf(item);
    //     this.expandedItems.splice(index, 1);
    //   } else {
    //     this.isLoading = true;
    //     try {
    //       // Use uma expressão regular para extrair o código de rastreio do link
    //       const regex = /\/([^/]+)\/?$/;
    //       const match = item.link.match(regex);
    //       if (match) {
    //         const codigoRastreio = match[1]; // O código de rastreio extraído

    //         const response = await axios.get(
    //           `https://api.linketrack.com/track/json?user=vitor.etur@gmail.com&token=965eefade2f5838dfd741d78e60e7dbaf2cc212a1db282035b66bf693fc2f500&codigo=${codigoRastreio}`
    //         );
    //         const data = response.data;

    //         if (data && data.eventos && data.eventos.length > 0) {
    //           item.eventos = data.eventos;
    //           console.log('Dados de rastreamento obtidos:', item.eventos);
    //         } else {
    //           item.eventos = [];
    //           console.warn('Nenhum dado de rastreamento encontrado.');
    //         }
    //       } else {
    //         console.error('Link de rastreamento inválido:', item.link);
    //         item.eventos = [];
    //       }
    //     } catch (error) {
    //       console.error('Erro ao buscar eventos de rastreamento:', error);
    //       item.eventos = [];
    //     } finally {
    //       this.isLoading = false;
    //       this.expandedItems.push(item);
    //     }
    //   }
    // },
  },
};
</script>

<style scoped>
  /* Adicione estilos personalizados aqui, se necessário */

  /* .copy-icon {
    color: #7926f0;
  }
  .expand-icon {
    cursor: pointer;
    color: #7926f0;
  } */

</style>
