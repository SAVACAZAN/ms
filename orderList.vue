<template>
  <b-tabs content-class="mt-3">


    <b-tab title="Tools" active>
      
      <b-table></b-table>
  
      <table>
      <tr>
        <td>
          
          <b-button size="sm" @click="setLower('buy', 1)" variant="secondary">1%</b-button>
          <b-button size="sm" @click="setUpper('buy',1)" variant="secondary">1%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.01)" variant="secondary"> 1%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.01)" variant="secondary"> 1%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.02)" variant="secondary"> 2%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.02)" variant="secondary"> 2%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.03)" variant="secondary"> 3%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.03)" variant="secondary"> 3%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.04)" variant="secondary"> 4%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.04)" variant="secondary"> 4%</b-button><br>
          <b-button size="sm" @click="setLower('buy',1.08)" variant="secondary"> 8%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.08)" variant="secondary"> 8%</b-button><br>
          <b-button size="sm" @click="setLower('buy',1.08)" variant="secondary"> 8%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.08)" variant="secondary"> 8%</b-button><br>
        </td>
        
          <td>         
          <b-button size="sm" @click="setLower('buy', 1)" variant="info">10%</b-button>
          <b-button size="sm" @click="setUpper('buy',1)" variant="info">10%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.1)" variant="info"> 10%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.1)" variant="info"> 10%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.11)" variant="info"> 11%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.11)" variant="info"> 11%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.13)" variant="info"> 13%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.13)" variant="info"> 13%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.14)" variant="info"> 14%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.14)" variant="info"> 14%</b-button><br>
          <b-button size="sm" @click="setLower('buy',1.18)" variant="info"> 18%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.18)" variant="info"> 18%</b-button><br>
          <b-button size="sm" @click="setLower('buy',1.18)" variant="info"> 18%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.18)" variant="info"> 18%</b-button><br>
        </td>
        <td>          
          <b-button size="sm" @click="setLower('buy', 1)" variant="success">10%</b-button>
          <b-button size="sm" @click="setUpper('buy',1)" variant="success">10%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.1)" variant="success"> 10%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.1)" variant="success"> 10%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.2)" variant="success"> 20%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.2)" variant="success"> 20%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.3)" variant="success"> 30%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.3)" variant="success"> 30%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.4)" variant="success"> 40%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.4)" variant="success"> 40%</b-button><br>
          <b-button size="sm" @click="setLower('buy',2.011)" variant="success"> 88%</b-button>
          <b-button size="sm" @click="setUpper('buy',2.011)" variant="success"> 88%</b-button><br>  
          <b-button size="sm" @click="setLower('buy',2.011)" variant="success"> 88%</b-button>
          <b-button size="sm" @click="setUpper('buy',2.011)" variant="success"> 88%</b-button><br>
        </td>
        <td>  
          <b-button size="sm" @click="setLower('buy', 1)" variant="danger">161.8%</b-button>
          <b-button size="sm" @click="setUpper('buy',1)" variant="danger">23.60%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.1)" variant="danger"> 138.2%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.1)" variant="danger"> 38.20%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.2)" variant="danger"> 78.60%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.2)" variant="danger"> 50.00%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.3)" variant="danger"> 61.80%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.3)" variant="danger"> 61.80%</b-button> <br>
          <b-button size="sm" @click="setLower('buy',1.4)" variant="danger"> 50.00%</b-button>
          <b-button size="sm" @click="setUpper('buy',1.4)" variant="danger"> 78.60%</b-button><br>
          <b-button size="sm" @click="setLower('buy',2.011)" variant="danger"> 38.2%</b-button>
          <b-button size="sm" @click="setUpper('buy',2.011)" variant="danger"> 138.2%</b-button><br>
          <b-button size="sm" @click="setLower('buy',2.011)" variant="danger"> 23.6%</b-button>
          <b-button size="sm" @click="setUpper('buy',2.011)" variant="danger"> 161.8%</b-button><br>


          


        </td>
      </tr>
    </table>

    <table>
      <tr>
        <td>
          <small>Amount:</small>
        </td>
        <td>
          <b-button size="sm" @click="setAmount(1)" variant="warning">1 {{this.market.quote}}</b-button>
          <b-button size="sm" @click="setAmount(2)" variant="warning">2 {{this.market.quote}}</b-button>
          <b-button size="sm" @click="setAmount(3)" variant="warning">3 {{this.market.quote}}</b-button>
          <b-button size="sm" @click="setAmount(5)" variant="warning">5 {{this.market.quote}}</b-button>
          <b-button size="sm" @click="setAmount(10)" variant="warning">10 {{this.market.quote}}</b-button>
          <b-button size="sm" @click="setAmount(20)" variant="warning">20 {{this.market.quote}}</b-button>
          <b-button size="sm" @click="setAmount(100)" variant="warning">100 {{this.market.quote}}</b-button>
          <b-button size="sm" @click="setAmount(200)" variant="warning">200 {{this.market.quote}}</b-button>
        </td>
      </tr>
      <tr>
        <td>
          <small>Increment</small>
        </td>
        <td>
          <b-button size="sm" @click="setIncrement(0.1)" variant="info">0.1</b-button>
          <b-button size="sm" @click="setIncrement(0.2)" variant="info">0.2</b-button>
          <b-button size="sm" @click="setIncrement(0.3)" variant="info">0.3</b-button>
          <b-button size="sm" @click="setIncrement(0.4)" variant="info">0.4</b-button>
          <b-button size="sm" @click="setIncrement(0.5)" variant="info">0.5</b-button>
          <b-button size="sm" @click="setIncrement(1)" variant="info">1</b-button>
          <b-button size="sm" @click="setIncrement(2)" variant="info">2</b-button>
          <b-button size="sm" @click="setIncrement(3)" variant="info">3</b-button>
          <b-button size="sm" @click="setIncrement(4)" variant="info">4</b-button>
          <b-button size="sm" @click="setIncrement(5)" variant="info">5</b-button>
          <b-button size="sm" @click="setIncrement(10)" variant="info">10</b-button>
          <b-button size="sm" @click="setIncrement(20)" variant="info">20</b-button>
          <b-button size="sm" @click="setIncrement(30)" variant="info">30</b-button>
          <b-button size="sm" @click="setIncrement(50)" variant="info">50</b-button>
          <b-button size="sm" @click="setIncrement(100)" variant="info">100</b-button>
          <b-button size="sm" @click="setIncrement(150)" variant="info">150</b-button>
          <b-button size="sm" @click="setIncrement(200)" variant="info">200</b-button>

        </td>
      </tr>
      <tr>
        <td>
          <small>Grids:</small>
        </td>
        <td>
          <b-button size="sm" @click="setGrids(1)" variant="primary">1</b-button>
          <b-button size="sm" @click="setGrids(5)" variant="primary">5</b-button>
          <b-button size="sm" @click="setGrids(10)" variant="primary">10</b-button>
          <b-button size="sm" @click="setGrids(20)" variant="primary">20</b-button>
          <b-button size="sm" @click="setGrids(30)" variant="primary">30</b-button>
          <b-button size="sm" @click="setGrids(50)" variant="primary">50</b-button>
          <b-button size="sm" @click="setGrids(100)" variant="primary">100</b-button>

        </td>
      </tr>
    </table>

    </b-tab>








    <b-tab title="Open Orders" >
      <button class="btn btn-outline-danger" @click="cancelOrders()">Cancel all</button>
      <b-table
        :items="openOrders.data"
        :fields="openOrders.fields"
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
    </b-tab>
    <b-tab title="Closed Orders">
      <b-table
        :items="closedOrders.data"
        :fields="closedOrders.fields"
        sort-icon-left
        small
        sticky-header="true"
        no-border-collapse
        responsive
      >
      </b-table>
    </b-tab>

    <b-tab title="Grid Orders">
  <b-table
    :items="gridOrders.data"
    :fields="gridOrders.fields"
    sort-icon-left
    small
  >
    <template #cell(delete)="row">
      <b-button size="sm" @click="deleteGridOrders(row)" class="mr-2">
        Delete
      </b-button>
          
      <b-button size="sm" @click="showGridOrdersOnChart(row)" class="mr-2">
        Put on chart
      </b-button>
          
      <b-button size="sm" @click="row.toggleDetails" class="mr-2">
        {{ row.detailsShowing ? 'Hide Details' : 'Show Details' }}
      </b-button>
    </template>

    <template #row-details="row">
      
      <tfoot>
    <tr>
      <td colspan="3">Aceasta este o legendă pentru acest tabel. </td>
      
    </tr>
  </tfoot>


      
  <b-card>
    <div class="table-wrapper">
      <table>
      <thead>
        
      </thead>
      <tbody>
        
        <tr v-for="(order, index) in row.item.orders" :key="order.id">
          <td class="numbered-cell">{{ index + 1 }}</td> <!-- afisarea numarului in tabel -->
          <ul class="order-details">

           <!-- <li :class="{ 'text-success': order.side === 'buy', 'text-danger': order.side === 'sell' }"><strong>Price:</strong> {{ order.price }}<strong>Q:</strong> {{ order.amount }}<strong>Side:</strong> {{ order.side }}</li>-->

            <li :class="{ 'text-success': order.side === 'buy', 'text-danger': order.side === 'sell' }"><strong>Price:</strong> {{ order.price }}</li>
            <li :class="{ 'text-success': order.side === 'buy', 'text-danger': order.side === 'sell' }"><strong>Cantitate:</strong> {{ order.amount }}</li>
            <li :class="{ 'text-success': order.side === 'buy', 'text-danger': order.side === 'sell' }"><strong>Side:</strong> {{ order.side }}</li>


            <li :class="{ 'text-success': order.newSide === 'buy', 'text-danger': order.newSide === 'sell' }"><strong>newSide:</strong> {{ order.newSide }}</li>
            <li :class="{ 'text-success': order.newSide === 'buy', 'text-danger': order.newSide === 'sell' }"><strong>Newprice:</strong> {{ order.newPrice }}</li>
            <li :class="{ 'text-success': order.newSide === 'buy', 'text-danger': order.newSide === 'sell' }"><strong>NewAmount:</strong> {{ order.newAmount }}</li>
      
             
              <li><strong>Profit FISE:</strong> {{ order.ProfitFISE }}<strong>Profit USD:</strong> {{ order.Profit }}</li>
              



              <li><strong>price close:</strong> {{ order.close }}</li>
              <li><strong>ID:</strong> {{ order.id }}</li>
            </ul>
        
        </tr>

        
      </tbody>
    </table>
    </div>
  </b-card>
</template>




  </b-table>
</b-tab>



<b-tab title="GridOrdersBalance">

</b-tab>
<b-tab title="Indicators">

</b-tab>
<b-tab title="Arbitrage">

</b-tab>
    
<b-tab title="DCA Bots">
      <b-table
        :items="dcaBots.data"
        :fields="dcaBots.fields"
        sort-icon-left
        small
      >
        <template #cell(show_details)="row">
          <b-button size="sm" @click="row.toggleDetails" class="mr-2">
            {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
          </b-button>
        </template>

        <template #row-details="row">
          <b-card>
            <b-table
              :items="row.item.deals"
              :fields="deals.fields"
              small
            >
              <template #cell(show_logs)="row">
                <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                  {{ row.detailsShowing ? 'Hide' : 'Show'}} Logs
                </b-button>
              </template>

              <template #row-details="row">
                <b-card>
                  <p v-for="log in row.item.logs" class="mb-0"><small>{{log}}</small></p>
                </b-card>
              </template>

            </b-table>
          </b-card>
        </template>

        <template #cell(start)="row">
          <b-button size="sm" @click="toggleBot(row)" class="mr-2">
            {{ row.item.status ? 'Stop' : 'Start'}}
          </b-button>
        </template>

        <template #cell(delete)="row">
          <b-button size="sm" @click="deleteBot(row)" class="mr-2">
            Delete
          </b-button>
        </template>
      </b-table>
    </b-tab>
  </b-tabs>
</template>

<script>
import Vue from "vue";

export default {
  name: "orderList",
  data: () => ({
    openOrders:{
      fields: [
        { key: 'datetime', sortable: true },
        { key: 'symbol', sortable: true },
        { key: 'type', sortable: true },
        { key: 'side', sortable: true },
        { key: 'price', sortable: true },
        { key: 'amount', sortable: true },
        { key: 'filled', sortable: true },
        { key: 'remaining', sortable: true },
        { key: 'actions', sortable: true },
      ],
      data:[]
    },
    closedOrders:{
      fields: [
        { key: 'datetime', sortable: true },
        { key: 'symbol', sortable: true },
        { key: 'type', sortable: true },
        { key: 'side', sortable: true },
        { key: 'price', sortable: true },
        { key: 'amount', sortable: true },
        { key: 'filled', sortable: true },
        { key: 'remaining', sortable: true },
      ],
      data:[]
    },
    gridOrders:{
      fields: [
        { key: 'name', sortable: true },
        { key: 'exchange', sortable: true },
        { key: 'symbol', sortable: true },
        { key: 'upperPrice', sortable: true },
        { key: 'lowerPrice', sortable: true },
        { key: 'amountType', sortable: true },
        { key: 'amount', sortable: true },
        { key: 'nrOfGrids', sortable: true },
        { key: 'ordersSide', sortable: true },
        { key: 'incrementalPercent', sortable: true },
        { key: 'delete', sortable: true },
      ],
      data:[]
    },
    dcaBots:{
      fields: [
        { key: 'show_details', sortable: true },
        // { key: 'datetime', sortable: true },
        { key: 'exchange', sortable: true },
        { key: 'symbol', sortable: true },
        // { key: 'baseOrderSize', sortable: true },
        // { key: 'takeProfit', sortable: true },
        // { key: 'safetyOrderSize', sortable: true },
        // { key: 'safetyOrdersPriceDeviation', sortable: true },
        // { key: 'maxSafetyOrdersCount', sortable: true },
        { key: 'profit', sortable: true },
        // { key: 'leverage', sortable: true },
        { key: 'status', sortable: true },
        { key: 'start', sortable: true },
        { key: 'delete', sortable: true },
      ],
      data:[]
    },
    deals:{
      fields:[
        { key: 'show_logs', sortable: true },
        { key: 'currentStatus', sortable: true },
        { key: 'direction', sortable: true },
        { key: 'safetyOrdersFilledNr', sortable: true },
        { key: 'profit', sortable: true },
        { key: 'actions', sortable: true },
      ]
    }
  }),
  props:[
    'exchange',
    'market',
  ],
  async fetch() {
    this.socket = this.$nuxtSocket({
      name: "main"
    });

    this.socket.emit('getOpenOrdersList', {
      exchange: this.exchange,
      symbol: this.market.symbol
    }, (resp) => {
      console.log(resp);
    })

    this.socket.on("streamOpenOrdersList", (ordersList) => {
      this.openOrders.data = ordersList.openOrders;
    });

    this.socket.emit('getClosedOrdersList', {
      exchange: this.exchange,
      symbol: this.market.symbol
    }, (resp) => {
      console.log(resp);
    })

    this.socket.on("streamClosedOrdersList", (ordersList) => {
      this.closedOrders.data = ordersList.closedOrders;
    });

    this.socket.emit('getGridOrdersList', {
      exchange: this.exchange,
      symbol: this.market.symbol
    }, (resp) => {
      console.log(resp);
    })

    this.socket.on("streamGridOrdersList", (gridOrders) => {
      console.log(gridOrders.gridOrders);
      this.gridOrders.data = gridOrders.gridOrders;
    });

    this.socket.emit('getDCABotsList', {
      exchange: this.exchange,
      symbol: this.market.symbol
    }, (resp) => {
      console.log(resp);
    })

    this.socket.on("streamDCABotsList", (ordersList) => {
      this.dcaBots.data = ordersList.dcaBots;
    });
  },
  methods:{
    cancelOrder: async function(id){
      let data = {
        exchange:this.exchange,
        symbol:this.market.symbol,
        id:id,
      };

      let response = await this.$http.$post('/cancel-order', {data});

      let log = null;
      if (response.success) {
        log = `Submitted ${data.exchange} cancel ${response.order.side} order for ${response.order.amount} ${this.market.base}`;
      } else {
        log = response.log;
      }

      this.$bvToast.toast(log, {
        title: `Cancel Order`,
        autoHideDelay: 5000,
        appendToast: true
      })
    },
    cancelOrders: async function(){
      let orders = this.openOrders.data;

      for (const order of orders) {
        await this.cancelOrder(order.id);
      }
    },
    toggleBot: async function(row) {
      let data = {
        id: row.item._id,
      };

      if (row.item.status) {
        await this.$http.$post('/stop-dca-bot',{data});
        row.item.status = false;

        let log = 'Successfully stopped DCA Bot';
        this.$bvToast.toast(log, {
          title: `Stop DCA Bot`,
          autoHideDelay: 5000,
          appendToast: true
        })
      } else {
        row.item.status = true;
        await this.$http.$post('/start-dca-bot',{data});

        let log = 'Successfully started DCA Bot';
        this.$bvToast.toast(log, {
          title: `Start DCA Bot`,
          autoHideDelay: 5000,
          appendToast: true
        })
      }
    },
    deleteGridOrders: async function(row) {
      let data = {
        exchange:row.item.exchange,
        id: row.item._id,
      };
      await this.$http.$post('/delete-grid-orders',{data});

      this.gridOrders.data = this.gridOrders.data.filter(function( obj ) {
        return obj._id !== row.item._id;
      });

      let log = 'Successfully deleted grid orders';
      this.$bvToast.toast(log, {
        title: `Delete Grid Orders`,
        autoHideDelay: 5000,
        appendToast: true
      })
    },
    showGridOrdersOnChart: async function(row) {
      // console.log(row);
      this.$root.$emit("setTextInComponentA", row);
    },
    deleteBot: async function(row) {
      let data = {
        id: row.item._id,
      };
      await this.$http.$post('/delete-dca-bot',{data});

      this.dcaBots.data = this.dcaBots.data.filter(function( obj ) {
        return obj._id !== row.item._id;
      });

      let log = 'Successfully deleted DCA Bot';
      this.$bvToast.toast(log, {
        title: `Delete DCA Bot`,
        autoHideDelay: 5000,
        appendToast: true
      })
    },
  },
  mounted: async function() {

  }
}
</script>

<style scoped>

</style>
<style>
table {
  font-size: 14px;
}

td {
  padding: 4px;
}
</style>

<style>
.order-details {
  list-style: none;
  padding: 0;
}

.order-details li {
  margin-bottom: 5px;
}

.order-details li span {
  font-weight: bold;
}

.a1 {
  color: red;
}

.a2 {
  color: blue;
}

.a3 {
  color: green;
}

.a4 {
  color: red;
}

.a5 {
  color: rgb(4, 81, 145);
}

.a6 {
  color: orange;
}

.a7 {
  color: rgba(241, 178, 6, 0.808);
}

.a8 {
  color: black;
}

.a9 {
  color: black;
}

.text-success {
  color: green;
}

.text-danger {
  color: red;
}

</style>
