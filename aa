<template>
  <b-form @submit="createOrder">
    <div class="balance text-right mb-2">
      <small>Available: <strong>{{balance}}</strong></small>
    </div>

    <b-form-group>
      <b-input-group>
        <b-form-input type="text" v-model="gridName" placeholder="Grid Name"></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <b-input-group>
        <b-form-input type="number" v-model="upperPrice" placeholder="Upper Price " step="any"></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <b-input-group>
        <b-form-input type="number" v-model="lowerPrice" placeholder="Lower Price " step="any"></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <b-input-group>
        <b-form-select v-model="amountType" :options="amountOptions"></b-form-select>
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <b-input-group :append="market.quote">
        <b-form-input type="number" v-model="amount" placeholder="Amount" step="any"></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <b-input-group append="%">
        <b-form-input type="number" v-model="incrementalPercent" placeholder="Incremental Percent" step="any"></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <b-input-group append="%">
        <b-form-input type="number" v-model="deviationPercent" placeholder="Deviation Percent" step="any"></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-row>
      <b-col cols="6">
        <b-form-group>
          <b-input-group append="Buy">
            <b-form-input type="number" v-model="deviationPRICEBuy" placeholder="Deviation PRICE " step="any"></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="6">
        <b-form-group>
          <b-input-group append="Sell">
            <b-form-input type="number" v-model="deviationPRICESell" placeholder="Deviation PRICE " step="any"></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>

    <b-form-group>
      <b-input-group>
        <b-form-input type="number" v-model="nrOfGrids" placeholder="Nr of grids" step="any"></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <b-input-group>
        <b-form-select v-model="ordersSide" :options="ordersSideOptions"></b-form-select>
      </b-input-group>
    </b-form-group>

    <b-button block type="submit" variant="primary">Create Grid</b-button>
  </b-form>
</template>


<script>
export default {
  name: "create-grid-orders-form",
  props:[
    'market',
    'exchange',
  ],
  data: () => ({
    gridName:'',
    amountOptions:[
      { value: 'quantityPerGrid', text: 'Qty Per Grid' },
      { value: 'totalAmount', text: 'Total Amount' },
      { value: 'incrementalPercent', text: 'Incremental Amount' },
      { value: 'deviationPercent', text: 'deviationPercent' },
      { value: 'deviationPRICEBuy', text: 'deviationPRICEBuy' },
      { value: 'deviationPRICESell', text: 'deviationPRICESell' },
    ],
    ordersSideOptions:[
      { value: 'buyOrSell', text: 'Buy & Sell' },
      { value: 'buyOnly', text: 'Buy Only' },
      { value: 'sellOnly', text: 'Sell Only' },
    ],
    lowerPrice:'',
    upperPrice:'',
    amountType:'quantityPerGrid',
    amount:'',
    nrOfGrids:'',
    ordersSide:'buyOrSell',
    incrementalPercent:'',
    deviationPercent:'',
    deviationPRICEBuy:'',
    deviationPRICESell:'',
    balance:0,
  }),
  methods:{
    createOrder: async function(event) {
      event.preventDefault();

      let data = {
        name: this.gridName,
        exchange:this.exchange,
        symbol:this.market.symbol,
        lowerPrice:this.lowerPrice,
        upperPrice:this.upperPrice,
        amountType:this.amountType,
        amount:this.amount,
        nrOfGrids:this.nrOfGrids,
        ordersSide:this.ordersSide,
        incrementalPercent:this.incrementalPercent,
        deviationPercent:this.deviationPercent,
        deviationPRICEBuy:this.deviationPRICEBuy,
        deviationPRICESell:this.deviationPRICESell,
      };

      let response = await this.$http.$post('/create-grid-orders',{data});



      console.log(response);

      let log = null;
      log = `Submitted grid order`;

      this.$bvToast.toast(log, {
        title: `Cancel Order`,
        autoHideDelay: 5000,
        appendToast: true
      })
    },
    setAmount: function(val){
      this.amount = val;
    },
    setIncrement: function(val){
      this.incrementalPercent = val;
    },

    setdeviationPercent: function(val){
      this.deviationPercent = val;
    },

    setdeviationPRICEBuy: function(val){
      this.deviationPRICEBuy = val;
    },
    setdeviationPRICESell: function(val){
      this.deviationPRICESell = val;
    },

    setGrids: function(val){
      this.nrOfGrids = val;
    },
    setLower: function(type, val){
      if (type === 'buy') {
        let table = document.getElementById('bids').getElementsByClassName('table');
        this.lowerPrice = table[0].rows[1].cells[0].innerHTML / val;
      } else {
        let table = document.getElementById('bids').getElementsByClassName('table');
        this.lowerPrice = table[0].rows[1].cells[0].innerHTML * val;
      }
    },
    setUpper: function(type, val){
      if (type === 'buy') {
        let table = document.getElementById('bids').getElementsByClassName('table');
        this.upperPrice = table[0].rows[1].cells[0].innerHTML * val;
      } else {
        let table = document.getElementById('bids').getElementsByClassName('table');
        this.upperPrice = table[0].rows[1].cells[0].innerHTML / val;
      }
    }
  },
}
</script>

<style scoped>

</style>
