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
      <b-input-group>
        <b-form-input type="number" v-model="nrOfGrids" placeholder="Nr of grids" step="any"></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <b-input-group>
        <b-form-select v-model="ordersSide" :options="ordersSideOptions"></b-form-select>
      </b-input-group>
    </b-form-group>


    <div>
      <div v-for="(set, index) in fieldSets" :key="index">
        <h4>deviation {{ set.tierNumber }}</h4>
        <b-button @click="addNewField">Adaugă</b-button>
        <b-row>
          <b-col cols="6">
            <b-form-group>
              <b-input-group append="Buy">
                <b-form-input type="number" v-model="set.buy" placeholder="Deviation PRICE " step="any"></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group>
              <b-input-group append="Sell">
                <b-form-input type="number" v-model="set.sell" placeholder="Deviation PRICE " step="any"></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </div>
   
    <div>
      <div v-for="(set, index) in fieldSets" :key="index">
        <h4>regroup {{ set.tierNumber }}</h4>
        <b-button @click="addRegroup">Adaugă</b-button>
        <b-row>
          <b-col cols="6">
            <b-form-group>
              <b-input-group append="Buy">
                <b-form-input type="number" v-model="set.buy" placeholder="regroup grid " step="any"></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group>
              <b-input-group append="Sell">
                <b-form-input type="number" v-model="set.sell" placeholder="regroup grid  " step="any"></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </div>
  
   
 



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
    tierOptions:[
      { value: 1, text: 'Tier 1' },
      { value: 2, text: 'Tier 2' },
      { value: 3, text: 'Tier 3' },
      { value: 4, text: 'Tier 4' },
      { value: 5, text: 'Tier 5' },
      { value: 6, text: 'Tier 6' },
      { value: 7, text: 'Tier 7' },
    ],
    tierCount: 1,
    fieldSets: [
      { tierNumber: 1, buy: null, sell: null },
    ],
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
        tierCount: this.tierCount,
        fieldSets: this.fieldSets,
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
    },
    setTier: function(index, type, value){
  if(type === 'buy'){
    this.fieldSets[index].buy = value;
  }else{
    this.fieldSets[index].sell = value;
  }
},
addNewField() {
    this.fieldSets.push(
      { tierNumber: this.fieldSets.length + 1, regroupGrids: null, regroupOlds: null },
      
    );
  },
  addRegroup() {
    this.fieldSets.push(
      { tierNumber: this.fieldSets.length + 1, regroupGrids: null, regroupOlds: null },
      
    );
  },



  setTierNumber: function(index, value){
  this.fieldSets[index].tierNumber = value;
}


  },
}
</script>

<style scoped>

</style>
