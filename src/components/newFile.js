import axios from 'axios';

export default (await import('vue')).defineComponent({
data() {
return {
campoPesquisa: '',
currentItem: null,
filteredData: [],
virtualItems: [],
expanded: [],
modalIsOpen: false,
mostrarTabela: false,
mostrarFiltro: false,
headers: [
{ title: 'DESTINATÁRIO', value: 'destinatario', align: 'center', sortable: false },
{ title: 'LINK', value: 'link', align: 'center', sortable: false },
{ title: 'CARTEIRINHA', value: 'carteirinha', align: 'center', sortable: false },
{ title: 'OBS', value: 'obs', align: 'center', sortable: false },
{ title: 'DATA DE CRIAÇÃO', value: 'dataCriacao', align: 'center', sortable: false }
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
var apiKey = 'AIzaSyDgWHhVhuLRFM3bBaNyKmsQylaqoOqYPQk';
// Intervalo de células para importar (por exemplo, 'Sheet1!A1:C10')
var range = 'RASTREIO!A2:E999999';
const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

fetch(url)
.then(response => response.json())
.then(data => {
const rows = data.values || [];
const searchData = rows.filter(row => row.some(value => value.toLowerCase().includes(this.campoPesquisa.toLowerCase())
)
);
this.filteredData = searchData.map(row => ({
destinatario: row[0],
link: row[1],
carteirinha: row[2],
obs: row[3],
dataCriacao: row[4],
eventos: [],
showModal: false, // Adicione a propriedade showModal
}));
this.resultadoPesquisa = `Códigos encontrados: ${searchData.length}`;
this.filteredData.reverse();
this.pagination.totalItems = this.filteredData.length;
// Defina mostrarTabela como true para mostrar a tabela
this.mostrarTabela = true;
this.mostrarFiltro = true;
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
const statusColorMap = {
'Objeto postado': { color: 'green', emoji: '🟢' },
'Objeto entregue ao destinatário': { color: 'green', emoji: '🟢' },
'Objeto saiu para entrega ao remetente': { color: 'blue', emoji: '🔵' },
'Objeto encaminhado': { color: 'blue', emoji: '🔵' },
'Objeto saiu para entrega ao destinatário': { color: 'blue', emoji: '🔵' },
'A entrega não pode ser efetuada - Endereço incorreto': { color: 'red', emoji: '🔴' },
'Objeto entregue ao remetente': { color: 'red', emoji: '🔴' },
'A entrega não pode ser efetuada - Empresa sem expediente': { color: 'red', emoji: '🔴' }
};
return statusColorMap[status] || { color: '', emoji: '' }; // Emoji e cor padrão
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

if (!item.eventos || item.eventos.length === 0) {
// Carregue os eventos de rastreamento quando abrir o modal
this.loadRastreamento(item);
}
},

closeStatusModal() {
this.modalIsOpen = false;

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
},
});
