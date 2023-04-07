<template>
  <b-form @submit="createOrder">
 

    <b-form-group>
      <b-input-group>
        <b-form-input type="text" v-model="gridName" placeholder="Grid Name"></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <b-input-group>
        <b-form-input type="number" v-model="upperPrice" placeholder="Upper Price" step="any"></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <b-input-group>
        <b-form-input type="number" v-model="lowerPrice" placeholder="Lower Price" step="any"></b-form-input>
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



    <div class="d-flex mb-3 justify-content-between">
  <b-button @click="addNewField" variant="primary" class="mr-2" :class="{ 'shadow-sm': level1Clicked }">Level1</b-button>
  <b-button @click="addRegroup" variant="primary" :class="{ 'shadow-sm': advancedModeClicked }">AdvancedMODE</b-button>
</div>


<div v-for="(set, index) in fieldSets" :key="set.id" v-if="level1Clicked">
  <h4>Level1 {{ set.tierNumber }}</h4>

  <b-row>
    <b-col cols="6">
      <b-form-group>
        <b-input-group append="">
          <b-form-input type="number" v-model="set.DeviationPRICEBuy" placeholder="DeviationPRICEBuy %" step="any"></b-form-input>
        </b-input-group>
      </b-form-group>
    </b-col>
    <b-col cols="6">
      <b-form-group>
        <b-input-group append="">
          <b-form-input type="number" v-model="set.DeviationPRICESell" placeholder="DeviationPRICESell %" step="any"></b-form-input>
        </b-input-group>
      </b-form-group>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="6">
      <b-form-group>
        <b-input-group append="">
          <b-form-input type="number" v-model="set.DeviationAMOUNTBuy" placeholder="DeviationAMOUNTBuy %" step="any"></b-form-input>
        </b-input-group>
      </b-form-group>
    </b-col>
    <b-col cols="6">
      <b-form-group>
        <b-input-group append="">
          <b-form-input type="number" v-model="set.DeviationAMOUNTSell" placeholder="DeviationAMOUNTSell %" step="any"></b-form-input>
        </b-input-group>
      </b-form-group>
    </b-col>
  </b-row>
  <b-button variant="danger" @click="removeField(set.id)">Elimină</b-button>
</div>



         

            <div v-for="(set, index) in fieldSets2" :key="set.id" v-if="advancedModeClicked">
           
                
                  
                  <h4>AdvancedMODE {{ set.tierNumber2 }}</h4>
                  <b-row>
                    <b-col cols="4">
                      <b-form-group>
                        <b-input-group append="">
                          <b-form-input type="number" v-model="nrOfGrids" placeholder="regroup grid old" step="any"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col cols="4">
                      <b-form-group>
                        <b-input-group append="">
                          <b-form-input type="number" v-model="set.newgridregroup" placeholder="regroup grid new" step="any"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col cols="4">
                      <b-form-group>
                        <b-input-group append="">
                          <b-form-input type="number" v-model="set.regroupbalance" placeholder="regroup balance %" step="any"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col cols="4">
                      <b-form-group>
                        <b-input-group append="">
                          <b-form-input type="number" v-model="set.rsi" placeholder="regroup RSI" step="any"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col cols="4">
                      <b-form-group>
                        <b-input-group append="">
                          <b-form-input type="number" v-model="set.macd" placeholder="regroup MACD" step="any"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col cols="4">
                      <b-form-group>
                        <b-input-group append="">
                          <b-form-input type="number" v-model="set.priceregroup" placeholder="regroup PRICE" step="any"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col cols="4">
                      <b-form-group>
                        <b-input-group append="">
                          <b-form-input type="number" v-model="set.fiblev" placeholder="fiblev" step="any"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                
                    <b-col cols="4">
                      <b-form-group>
                        <b-input-group append="">
                          <b-form-input type="number" v-model="set.rangelowerPrice" placeholder="rangelowerPrice" step="any"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col cols="4">
                      <b-form-group>
                        <b-input-group append="">
                          <b-form-input type="number" v-model="set.rangeupperPrice" placeholder="rangeupperPrice" step="any"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
              
                    

                
                    <b-col cols="4">
                      <b-form-group>
                        <b-input-group append="">
                          <b-form-input type="number" v-model="set.fibdowntrend" placeholder="fibdowntrend" step="any"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col cols="4">
                      <b-form-group>
                        <b-input-group append="">
                          <b-form-input type="number" v-model="set.fibuptrend" placeholder="fibuptrend" step="any"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>

                    

                  </b-row>
                  <b-button variant="danger" @click="removeRegroup(index)">Elimină</b-button>
                </div>
              
             
              
        <b-button block type="submit" variant="primary">Create Grid</b-button>
  
          <div class="balance text-right mb-2">
              <small>Available: <strong>{{balance}}</strong></small>
            </div>
  
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
     
      // { value: 'deviationPRICEBuy', text: 'deviationPRICEBuy' },
      // { value: 'deviationPRICESell', text: 'deviationPRICESell' },

      // { value: 'regroup', text: 'regroup' },
      // { value: 'regroup.oldgrid', text: 'regroup.oldgrid' },
      // { value: 'regroup.newgrid', text: 'regroup.newgrid' },
      // { value: 'regroup.balance', text: 'regroup.balance' },
      // { value: 'regroup.RSI', text: 'regroup.RSI' },
      // { value: 'regroup.MACD', text: 'regroup.MACD' },
      // { value: 'regroup.PRICE', text: 'regroup.PRICE' },
      // { value: 'regroup.fiblev', text: 'regroup.fiblev' },
      // { value: 'regroup.rangepriceLower', text: 'regroup.rangepriceLower' },
      // { value: 'regroup.rangepriceUpper', text: 'regroup.rangepriceUpper' },
      // { value: 'regroup.fibdowntrend', text: 'regroup.fibdowntrend' },
      // { value: 'regroup.fibuptrend', text: 'regroup.fibuptrend' },

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
      {
        tierNumber: 1,
        DeviationPRICEBuy: null,
        DeviationPRICESell: null,
        DeviationAMOUNTBuy: null,
        DeviationAMOUNTSell: null ,
        
      },
    ],
    level1Clicked: false, // Add this line
    fieldSets2: [
      { tierNumber2:  1, 
        newgridregroup: '',
        oldgridregroup: '',
        regroupbalance: '',
        rsi: '',
        macd: '',
        priceregroup: '',
        fiblev: '',
        rangelowerPrice: '',
        rangeupperPrice: '',
        fibdowntrend: '',
        fibuptrend: ''
      },
    ],
  }),
  methods: {
    createOrder: async function(event) {
      event.preventDefault();
      let field = null; // declarare si initializare variabila 'field'
      const orders = []; // initialize the orders variable as an empty array

      if (field && field.DeviationPRICEBuy) {
        const deviationPriceBuy = Number(field.DeviationPRICEBuy);
        // calculează noul preț pentru fiecare comandă din orders
        const updatedOrders = orders.map(order => {
          const oldPrice = Number(order.price);
          const newPrice = deviationPriceBuy * oldPrice;
          return {
            ...order,
            newPrice
          };
        });
      }
  


 const data = {
  name: this.gridName,
  exchange: this.exchange,
  symbol: this.market.symbol,
  lowerPrice: this.lowerPrice,
  upperPrice: this.upperPrice,
  amountType: this.amountType,
  amount: this.amount,
  nrOfGrids: this.nrOfGrids,
  ordersSide: this.ordersSide,
  incrementalPercent: this.incrementalPercent,
  tierCount: this.tierCount,
  fieldSets: [],
  fieldSets2: [],
  };

  if (this.fieldSets && this.fieldSets.length > 0) {
    data.fieldSets = this.fieldSets.map(field => ({
      tierNumber: this.tierNumber,
      DeviationPRICEBuy: this.DeviationPRICEBuy,
      DeviationPRICESell: this.DeviationPRICESell,
      DeviationAMOUNTBuy: this.DeviationAMOUNTBuy,
      DeviationAMOUNTSell: this.DeviationAMOUNTSell,
      fieldSetsData: this.fieldSetsData || []
    }));

    data.fieldSets2 = this.fieldSets2.map(field => ({
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
    fieldSetsData2: field.fieldSetsData2 || []
  }))};

  let response = await this.$http.$post('/create-grid-orders', { data });

  console.log(response);

  let log = null;
  log = `Submitted grid order`;

  this.$bvToast.toast(log, {
    title: `Cancel Order`,
    autoHideDelay: 5000,
    appendToast: true
  });
},

  setAmount: function(val){
      this.amount = val;
    },
    setIncrement: function(val){
      this.incrementalPercent = val;
    },
    setdeviationPRICEBuy: function(val){
      this.DeviationPRICEBuy = val;
    },
    setdeviationPRICESell: function(val){
      this.DeviationPRICESell = val;
    },

    setnewgridregroup: function(val){
      this.newgridregroup = val;
    },
    setoldgridregroup: function(val){
      this.oldgridregroup = val;
    },


    setpriceregroup: function(val){
      this.priceregroup = val;
    },

    setrangelowerPrice: function(val){
      this.rangelowerPrice = val;
    },

    setrsi: function(val){
      this.rsi = val;
    },

    setmacd: function(val){
      this.macd = val;
    },
    setfiblev: function(val){
      this.fiblev = val;
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
    setTier: function(index, type, val){
      if(type === 'buy'){
        this.fieldSets[index].buy = val;
      } else {
        this.fieldSets[index].sell = val;
      }
    },
    setTier2: function(index, type, val){
      if(type === 'old'){
        this.fieldSets2[index].oldgridregroup = val;
      } else if(type === 'new'){
        this.fieldSets2[index].newgridregroup = val;
      } else if(type === 'balance'){
        this.fieldSets2[index].regroupbalance = val;
      } else if(type === 'RSI'){
        this.fieldSets2[index].rsi = val;
      } else if(type === 'MACD'){
        this.fieldSets2[index].macd = val;
      } else if(type === 'price'){
        this.fieldSets2[index].priceregroup = val;
      } else if(type === 'fiblevel'){
        this.fieldSets2[index].fiblevel = val;
      } else if(type === 'lowerPrice'){
        this.fieldSets2[index].rangelowerPrice = val;
      } else if(type === 'upperPrice'){
        this.fieldSets2[index].rangeupperPrice = val;
      } else if(type === 'fibdowntrend'){
        this.fieldSets2[index].fibdowntrend = val;
      } else if(type === 'fibuptrend'){
        this.fieldSets2[index].fibuptrend = val;
      }
    },

    addNewField: function() {
  if (!this.level1Clicked) {
    this.level1Clicked = true;
  }
  if (this.fieldSets.length < 7) {
    this.fieldSets.push({ 
      tierNumber: this.fieldSets.length + 1,
      DeviationPRICEBuy: '',
      DeviationPRICESell: '',
      DeviationAMOUNTBuy: '',
      DeviationAMOUNTSell: '',
     
    });
  }
},


addRegroup: function() {
  if (!this.advancedModeClicked) {
    this.advancedModeClicked = true;
  }
  if (this.fieldSets2.length < 7) {
  this.fieldSets2.push({
    tierNumber2: this.fieldSets2.length + 1,
    newgridregroup: null,
    regroupbalance: null,
    rsi: null,
    macd: null,
    priceregroup: null,
    fiblev: null,
    rangelowerPrice: null,
    rangeupperPrice: null,
    fibdowntrend: null,
    fibuptrend: null
  });
  }
},




    removeField(index) {
    this.fieldSets.splice(index, 1);
   },
  
    removeRegroup(index) {
    this.fieldSets2.splice(index, 1);
   },
    setTierNumber: function(index, value){
      this.fieldSets[index].tierNumber = value;
    }
  },
}
</script>

<style scoped>


/* Stil pentru butonul "Adaugă" */
button {
  background-color: #00010f;
  border: none;
  color: white;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  cursor: pointer;
}

/* Stil pentru inputuri */
input[type="number"] {
  width: 28%;
  padding: 0px 03px;
  margin: 0px 0;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 2px;
}

/* Stil pentru etichetele "deviation" si "regroup" */
h4 {
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 0px;
  color: #93d31b;
}

/* Stil pentru randuri si coloane */
.b-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.b-col {
  position: relative;
  width: 80%;
  padding-right: 5px;
  padding-left: 5px;
}

@media (min-width: 576px) {
  .b-col {
    flex: 0 0 auto;
    width: 88%;
    max-width: 88%;
  }
}

@media (min-width: 768px) {
  .b-col {
    flex: 0 0 auto;
    width: 88%;
    max-width: 88%;
  }
}

@media (min-width: 992px) {
  .b-col {
    flex: 0 0 auto;
    width: 88%;
    max-width: 100%;
  }
}

@media (min-width: 1200px) {
  .b-col {
    flex: 0 0 auto;
    width: 100%;
    max-width: 100%;
  }
}

/* Style for the first input placeholder */
input[placeholder="Grid Name"]::placeholder {
  background-color: #222729;
  color: #c4c70d;
}

/* Style for the first input when focused */
input[placeholder="Grid Name"]:focus {
  background-color: #0de3eb;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="Grid Name"]:not(:focus) {
  background-color: #0a0a0a;
  color: #0be9de;
}


/* Style for the first input placeholder */
input[placeholder="Upper Price"]::placeholder {
  background-color: #f84d0a;
  color: #fff;
}

/* Style for the first input when focused */
input[placeholder="Upper Price"]:focus {
  background-color: #0de3eb;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="Upper Price"]:not(:focus) {
  background-color: #f84d0a;
  color: #fff;
}
/* Style for the first input placeholder */
input[placeholder="Lower Price"]::placeholder {
  background-color: #1ba82e;
  color: #fff;
}

/* Style for the first input when focused */
input[placeholder="Lower Price"]:focus {
  background-color: #0de3eb;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="Lower Price"]:not(:focus) {
  background-color: #1ba82e;
  color: #fff;
}





/* Style for the fourth input placeholder */


/* Style for the first input placeholder */
input[placeholder="Amount"]::placeholder {
  background-color: #3700ff;
  color: #fff;
}

/* Style for the first input when focused */
input[placeholder="Amount"]:focus {
  background-color: #0de3eb;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="Amount"]:not(:focus) {
  background-color: #3700ff;
  color: #fff;
}



/* Style for the first input placeholder */
input[placeholder="Incremental Percent"]::placeholder {
  background-color: #500550;
  color: #fff;
}

/* Style for the first input when focused */
input[placeholder="Incremental Percent"]:focus {
  background-color: #0de3eb;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="Incremental Percent"]:not(:focus) {
  background-color: #500550;
  color: #fff;
}







/* Style for the first input placeholder */
input[placeholder="Nr of grids"]::placeholder {
  background-color: #150655;
  color: #fff;
}

/* Style for the first input when focused */
input[placeholder="Nr of grids"]:focus {
  background-color: #0de3eb;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="Nr of grids"]:not(:focus) {
  background-color: #150655;
  color: #fff;
}




/* Style for the first input placeholder */
input[placeholder="DeviationPRICEBuy %"]::placeholder {
  background-color: #1ba82e;
  color: #fff;
}

/* Style for the first input when focused */
input[placeholder="DeviationPRICEBuy %"]:focus {
  background-color: #ebe70d;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="DeviationPRICEBuy %"]:not(:focus) {
  background-color: #1ba82e;
  color: #fff;
}

/* Style for the first input placeholder */
input[placeholder="DeviationAMOUNTBuy %"]::placeholder {
  background-color: #1ba82e;
  color: #fff;
}

/* Style for the first input when focused */
input[placeholder="DeviationAMOUNTBuy %"]:focus {
  background-color: #ebe70d;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="DeviationAMOUNTBuy %"]:not(:focus) {
  background-color: #1ba82e;
  color: #fff;
}







/* Style for the first input placeholder */
input[placeholder="DeviationPRICESell %"]::placeholder {
  background-color: #f84d0a;
  color: #fff;
}

/* Style for the first input when focused */
input[placeholder="DeviationPRICESell %"]:focus {
  background-color: #ebe70d;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="DeviationPRICESell %"]:not(:focus) {
  background-color: #f84d0a;
  color: #fff;
}



/* Style for the first input placeholder */
input[placeholder="DeviationAMOUNTSell %"]::placeholder {
  background-color: #f84d0a;
  color: #fff;
}

/* Style for the first input when focused */
input[placeholder="DeviationAMOUNTSell %"]:focus {
  background-color: #ebe70d;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="DeviationAMOUNTSell %"]:not(:focus) {
  background-color: #f84d0a;
  color: #fff;
}


/* Style for the first input placeholder */
input[placeholder="regroup grid old"]::placeholder {
  background-color: #312724;
  color: #fff;
}

/* Style for the first input when focused */
input[placeholder="regroup grid old"]:focus {
  background-color: #ebe70d;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="regroup grid old"]:not(:focus) {
  background-color: #312724;
  color: #fff;
}



/* Style for the first input placeholder */
input[placeholder="regroup grid new"]::placeholder {
  background-color: #312724;
  color: #fff;
}

/* Style for the first input when focused */
input[placeholder="regroup grid new"]:focus {
  background-color: #ebe70d;
  color: #fff;
}

/* Style for the first input when not focused */
input[placeholder="regroup grid new"]:not(:focus) {
  background-color: #312724;
  color: #fff;
}



/* Style for the ninth input placeholder */
input[placeholder="regroup balance %"]::placeholder {
  background-color: #312724;
  color: #ffff00;
}
/* Style for the first input when focused */
input[placeholder="regroup balance %"]:focus {
  background-color: #ebe70d;
  color: #ffff00;
}

/* Style for the first input when not focused */
input[placeholder="regroup balance %"]:not(:focus) {
  background-color: #312724;
  color: #ffff00;
}





/* Style for the tenth input placeholder */
input[placeholder="regroup RSI"]::placeholder {
  background-color: #ff00ff;
}

/* Style for the first input placeholder */
input[placeholder="regroup RSI"]::placeholder {
  background-color: #03000e;
  color: #00fff2;
}

/* Style for the first input when focused */
input[placeholder="regroup RSI"]:focus {
  background-color: #ebe70d;
  color: #0f0f0f;
}

/* Style for the first input when not focused */
input[placeholder="regroup RSI"]:not(:focus) {
  background-color: #03000e;
  color: #00fff2;
}






/* Style for the eleventh input placeholder */

/* Style for the first input placeholder */
input[placeholder="regroup MACD"]::placeholder {
  background-color: #03000e;
  color: #155aee;
}

/* Style for the first input when focused */
input[placeholder="regroup MACD"]:focus {
  background-color: #ebe70d;
  color: #0f0f0f;
}

/* Style for the first input when not focused */
input[placeholder="regroup MACD"]:not(:focus) {
  background-color: #03000e;
  color: #155aee;
}






/* Style for the twelfth input placeholder */

/* Style for the first input placeholder */
input[placeholder="regroup PRICE"]::placeholder {
  background-color: #03000e;
  color: #ebe70d;
}

/* Style for the first input when focused */
input[placeholder="regroup PRICE"]:focus {
  background-color: #ebe70d;
  color: #0f0f0f;
}

/* Style for the first input when not focused */
input[placeholder="regroup PRICE"]:not(:focus) {
  background-color: #03000e;
  color: #ebe70d;
}




/* Style for the thirteenth input placeholder */


/* Style for the first input placeholder */
input[placeholder="fiblev"]::placeholder {
  background-color: #03000e;
  color: #b610a8;
}

/* Style for the first input when focused */
input[placeholder="fiblev"]:focus {
  background-color: #ebe70d;
  color: #0f0f0f;
}

/* Style for the first input when not focused */
input[placeholder="fiblev"]:not(:focus) {
  background-color: #03000e;
  color: #b610a8;
}




/* Style for the thirteenth input placeholder */

/* Style for the first input placeholder */
input[placeholder="rangelowerPrice"]::placeholder {
  background-color: #03000e;
  color: #0fdf0f;
}

/* Style for the first input when focused */
input[placeholder="rangelowerPrice"]:focus {
  background-color: #ebe70d;
  color: #0f0f0f;
}

/* Style for the first input when not focused */
input[placeholder="rangelowerPrice"]:not(:focus) {
  background-color: #03000e;
  color: #0fdf0f;
}












/* Style for the fourteenth input placeholder */

/* Style for the first input placeholder */
input[placeholder="rangeupperPrice"]::placeholder {
  background-color: #03000e;
  color: #d30707;
}

/* Style for the first input when focused */
input[placeholder="rangeupperPrice"]:focus {
  background-color: #ebe70d;
  color: #0f0f0f;
}

/* Style for the first input when not focused */
input[placeholder="rangeupperPrice"]:not(:focus) {
  background-color: #03000e;
  color: #d30707;
}





/* Style for the fifteenth input placeholder */

/* Style for the first input placeholder */
input[placeholder="fibdowntrend"]::placeholder {
  background-color: #03000e;
  color: #2fdd0c;
}

/* Style for the first input when focused */
input[placeholder="fibdowntrend"]:focus {
  background-color: #ebe70d;
  color: #0f0f0f;
}

/* Style for the first input when not focused */
input[placeholder="fibdowntrend"]:not(:focus) {
  background-color: #03000e;
  color: #2fdd0c;
}





/* Style for the sixteenth input placeholder */


/* Style for the first input placeholder */
input[placeholder="fibuptrend"]::placeholder {
  background-color: #03000e;
  color: #da2108;
}

/* Style for the first input when focused */
input[placeholder="fibuptrend"]:focus {
  background-color: #ebe70d;
  color: #0f0f0f;
}

/* Style for the first input when not focused */
input[placeholder="fibuptrend"]:not(:focus) {
  background-color: #03000e;
  color: #da2108;
}

/* Micsoreaza dimensiunea celulelor */
input[type="number"] {
  font-size: 14px;
  padding: 1px 5px;
}

/* Micsoreaza dimensiunea paginii */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

</style>
