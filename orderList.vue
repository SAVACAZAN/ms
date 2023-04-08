<template>

<b-tabs content-class="mt-3" v-model="activeTab">
   <b-tab title="Tools" active>
       <b-table>

      </b-table>
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

 <b-button variant="primary" @click="updateGridOrders">Adaugă grid</b-button>

<b-tab title="GridOrdersBalance">
</b-tab>



  <b-tab title="DailyTrading">
</b-tab>



    
<b-tab title="Strategies" :active="isStrategiesActive">
  <!-- conținutul tab-ului Strategies -->
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

    
    // gridOrders:{
    //   fields: [
    //     { key: 'name', sortable: true },
    //     { key: 'exchange', sortable: true },
    //     { key: 'symbol', sortable: true },
    //     { key: 'upperPrice', sortable: true },
    //     { key: 'lowerPrice', sortable: true },
    //     { key: 'amountType', sortable: true },
    //     { key: 'amount', sortable: true },
    //     { key: 'nrOfGrids', sortable: true },
    //     { key: 'ordersSide', sortable: true },
    //     { key: 'incrementalPercent', sortable: true },
    //     { key: 'delete', sortable: true },
    //     { key: 'DeviationPRICEBuy', sortable: true },
    //     { key: 'DeviationPRICESell', sortable: true },
    //     { key: 'DeviationAMOUNTBuy', sortable: true },
    //     { key: 'DeviationAMOUNTSell', sortable: true },
    //     { key: 'newgridregroup', sortable: true },
    //     { key: 'oldgridregroup', sortable: true },
    //     { key: 'regroupbalance', sortable: true },
    //     { key: 'rsi', sortable: true },
    //     { key: 'macd', sortable: true },
    //     { key: 'priceregroup', sortable: true },
    //     { key: 'fiblev', sortable: true },
    //     { key: 'rangelowerPrice', sortable: true },
    //     { key: 'rangeupperPrice', sortable: true },
    //     { key: 'fibdowntrend', sortable: true },
    //     { key: 'fibuptrend', sortable: true },
    //     { key: 'DailyTrading1min', sortable: true },
    //     { key: 'DailyTrading5min', sortable: true },
    //     { key: 'DailyTrading15min', sortable: true },
    //     { key: 'DailyTrading30min', sortable: true },
    //     { key: 'Strategies1min', sortable: true },
    //     { key: 'Strategies5min', sortable: true },
    //     { key: 'Strategies15min', sortable: true },
    //     { key: 'Strategies30min', sortable: true },          
    //   ],     
    //   data:[]      
   // },


   gridOrders: {
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
    { key: 'delete', sortable: true }
  ],
  data: [],
  fieldSets: {
    level1: [],
    advancedMode: [],
    dailyTrading: [],
    strategies: []
  }
},
activeTab: 0,

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

    addStrategies() {
      this.activeTab = 4; // indexul tabului "Strategies"
    },



    updateGridOrders() {
    const name = this.gridName;
    const exchange = this.exchange;
    const symbol = this.market.symbol;
    const lowerPrice = this.lowerPrice;
    const upperPrice = this.upperPrice;
    const amountType = this.amountType;
    const amount = this.amount;
    const nrOfGrids = this.nrOfGrids;
    const ordersSide = this.ordersSide;
    const incrementalPercent = this.incrementalPercent;
    const tierCount = this.tierCount;
    const fieldSetslevel1 = this.fieldSetslevel1;
    const fieldSetsadvancedMode = this.fieldSetsadvancedMode;
    const fieldSetsDailyTrading = this.fieldSetsDailyTrading;
    const fieldSetsStrategies = this.fieldSetsStrategies;

    const level1Fields = fieldSetslevel1.map(field => ({
      ...field,
      tierNumber: this.tierNumber,
      DeviationPRICEBuy: this.DeviationPRICEBuy,
      DeviationPRICESell: this.DeviationPRICESell,
      DeviationAMOUNTBuy: this.DeviationAMOUNTBuy,
      DeviationAMOUNTSell: this.DeviationAMOUNTSell,
      fieldSetslevel1Data: this.fieldSetlevel1sData || []
    }));

    const advancedModeFields = fieldSetsadvancedMode.map(field => ({
      ...field,
      tierNumber2: this.tierNumber2,
      newgridregroup: field.newgridregroup === null ? null : Number(field.newgridregroup),
      oldgridregroup: field.oldgridregroup === null ? null : Number(field.oldgridregroup),
      regroupbalance: field.regroupbalance === null ? null : Number(field.regroupbalance),
      rsi: field.rsi === null ? null : Number(field.rsi),
      macd: field.macd === null ? null : Number(field.macd),
      priceregroup: field.priceregroup === null ? null : Number(field.priceregroup),
      fiblev: field.fiblev === null ? null : Number(field.fiblev),
      rangelowerPrice: field.rangelowerPrice === null ? null : Number(field.rangelowerPrice),
      rangeupperPrice: field.rangeupperPrice === null ? null : Number(field.rangeupperPrice),
      fibdowntrend: field.fibdowntrend === null ? null : Number(field.fibdowntrend),
      fibuptrend: field.fibuptrend === null ? null : Number(field.fibuptrend),
      fieldSetsadvancedModeData: field.fieldSetsadvancedModeData || []
    }));

    const dailyTradingFields = fieldSetsDailyTrading.map(field => ({
      ...field,
      tierNumber: this.tierNumber,
      DailyTrading1min: this.DailyTrading1min,
      DailyTrading5min: this.DailyTrading5min,
      DailyTrading15min: this.DailyTrading15min,
      DailyTrading30min: this.DailyTrading30min,
      fieldSetsDailyTradingData: this.fieldSetsDailyTradingData || []
    }));

    const strategiesFields = fieldSetsStrategies.map(field => ({
      ...field,
      tierNumber: this.tierNumber,
      Strategies1min: this.Strategies1min,
      Strategies5min: this.Strategies5min,
      Strategies15min: this.Strategies15min,
      Strategies30min: this.Strategies30min,
      fieldSetsStrategiesData: this.fieldSetsStrategiesData || []
    }));

    const newGridOrder = {
      name,
      exchange,
      symbol,
      lowerPrice,
      upperPrice,
      amountType,
      amount,
      nrOfGrids,
      ordersSide,
      incrementalPercent,
      tierCount,
      level1Fields,
      advancedModeFields,
      dailyTradingFields,
      strategiesFields
    };

    this.gridOrders.data.push(newGridOrder);
    this.gridOrders.fieldSets.level1.push(...level1Fields);
    this.gridOrders.fieldSets.advancedMode.push(...advancedModeFields);
    this.gridOrders.fieldSets.dailyTrading.push(...dailyTradingFields);
    this.gridOrders.fieldSets.strategies.push(...strategiesFields);
  },



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
