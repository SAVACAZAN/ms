<template>
  <b-table
    :items="balanceData"
    :fields="balanceFields"
    sort-icon-left
    small
    sticky-header="true"
    no-border-collapse
    responsive
  >
    <template #cell(actions)="row">
      <b-button size="sm" @click="cancelOrder(row.item.id)" class="mr-2">
        Cancel
      </b-button>
    </template>
  </b-table>
</template>

<script>
export default {
  name: "view-balance",
  props:[
    'market',
    'exchange',
  ],
  data: () => ({
    balance:0,
    balanceData:[],
    balanceFields: [
      { key: 'currency', sortable: true },
      { key: 'free', sortable: true },
      { key: 'used', sortable: true },
      { key: 'total', sortable: true },
    ],
  }),
  async fetch() {

    this.socket = this.$nuxtSocket({
      name: "main"
    });

    this.socket.emit('getBalance', {
      exchange: this.exchange,
    }, (resp) => {
      console.log(resp);
    })

    this.socket.on("streamBalance", (balance) => {
      this.balanceData = this.formatBalance(balance.data);
    });
  },
  mounted: async function() {

  },
  methods:{
    formatBalance: function(rawBalance) {
      //balance logic
      let currenciesBalance = [];

      for (const property in rawBalance.total) {
        if (rawBalance.total[property] !== 0) {
          currenciesBalance.push({
            currency: property,
            free:0,
            used:0,
            total:rawBalance.total[property]
          })
        }
      }

      for (const property in rawBalance.free) {
        for (let i = 0; i < currenciesBalance.length; i++) {
          if (currenciesBalance[i].currency === property) {
            currenciesBalance[i].free = rawBalance.free[property];
          }
        }
      }

      for (const property in rawBalance.used) {
        for (let i = 0; i < currenciesBalance.length; i++) {
          if (currenciesBalance[i].currency === property) {
            currenciesBalance[i].used = rawBalance.used[property];
          }
        }
      }
currenciesBalance.sort(function(a, b) {
  if (a.currency < b.currency) {
    return -1;
  }
  if (a.currency > b.currency) {
    return 1;
  }
  return 0;
});

      return currenciesBalance;
    }
  },
}
</script>

<style scoped>

</style>
