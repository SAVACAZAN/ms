<template>
  <b-container fluid>
    <tickerBar :activeMarket="activeMarket" :activeExchange="activeExchange" :markets="markets" :exchanges="exchanges"/>
    <b-row class="content" style="height: 86vh">
      <b-col cols="9">
        <b-row>
          <b-col cols="9">
            <chart :market="activeMarket" :exchange="activeExchange"/>
          </b-col>
          <b-col cols="3">
            <orderBook :market="activeMarket" :exchange="activeExchange"/>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <orderList :market="activeMarket" :exchange="activeExchange"/>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="3">
        <div class="div" style="height: 60%; width:100%">
          <b-tabs content-class="mt-3">
            <b-tab title="Spot">
              <b-tabs content-class="mt-3">
                <b-tab title="Limit" >
                  <b-row>
                    <b-col cols="12">
                      <b-card bg-variant="light">
                        <createLimitOrdersForm :market="activeMarket" :exchange="activeExchange" side="buy"/>
                      </b-card>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <b-card bg-variant="light">
                        <createLimitOrdersForm :market="activeMarket" :exchange="activeExchange" side="sell"/>
                      </b-card>
                    </b-col>
                  </b-row>
                </b-tab>
                <b-tab title="Market">
                  <b-row>
                    <b-col cols="12">
                      <b-card bg-variant="light">
                        <createMarketOrdersForm :market="activeMarket" :exchange="activeExchange" side="buy"/>
                      </b-card>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <b-card bg-variant="light">
                        <createMarketOrdersForm :market="activeMarket" :exchange="activeExchange" side="sell"/>
                      </b-card>
                    </b-col>
                  </b-row>
                </b-tab>
                <b-tab title="OCO">
                  <b-row>
                    <b-col cols="12">
                      <b-card bg-variant="light">
                        <createOcoOrdersForm :market="activeMarket" :exchange="activeExchange" side="buy"/>
                      </b-card>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <b-card bg-variant="light">
                        <createOcoOrdersForm :market="activeMarket" :exchange="activeExchange" side="sell"/>
                      </b-card>
                    </b-col>
                  </b-row>
                </b-tab>
              </b-tabs>
            </b-tab>
            <b-tab title="Grid Orders" active>
              <b-row>
                <b-col cols="12">
                  <b-card bg-variant="light">
                    <createGridOrdersForm :market="activeMarket" :exchange="activeExchange"/>
                  </b-card>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="DCA ">
              <b-row>
                <b-col cols="12">
                  <b-card bg-variant="light">
                    <createDcaBotsForm :market="activeMarket" :exchange="activeExchange"/>
                  </b-card>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="Balance">
              <b-row>
                <b-col cols="12">
                  <b-card bg-variant="light">
                    <viewBalance :market="activeMarket" :exchange="activeExchange"/>
                  </b-card>
                </b-col>
              </b-row>
            </b-tab>
            
            <b-tab title="grid AI">
              <b-row>
                <b-col cols="12">
                  <b-card bg-variant="light">
                    <create-grid-AI-form :market="activeMarket" :exchange="activeExchange"/>
                  </b-card>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="test">
              <b-row>
                <b-col cols="12">
                  <b-card bg-variant="light">
                   



                    
                  </b-card>
                </b-col>
              </b-row>
            </b-tab>




          </b-tabs>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>








<script>
import {forEach} from "lodash";

export default {
  middleware: 'auth',
  name: 'Index',
  data() {
    return {
      exchanges: [],
      activeExchange: null,
      markets: [],
      activeMarket: {
        symbol: null,
        base: null,
        quote: null,
        type: null,
      },
      SUMBUY: 0,
      SUMBUYX: 0,
      average: 0,
      nrOfGrids: 0,
      incrementalPercent: 0,
      deviationPercent: 0,
      deviationGRIDno: 0,
      symbol: ''
    }
  },
  async asyncData({$http}) {

    let dbExchanges = await $http.$get(`/get-db-exchanges`);
    let exchanges = [];
    let activeExchange = null;
    let activeMarket = null;
    let exchangeID = null;

    for (let i = 0; i < dbExchanges.length; i++) {
      exchanges.push(dbExchanges[i].exchange);
      if (dbExchanges[i].isActive) {
        activeExchange = dbExchanges[i].exchange;
        activeMarket = {
          symbol: dbExchanges[i].defaultMarket,
          base: dbExchanges[i].defaultMarket.split('/')[0],
          quote: dbExchanges[i].defaultMarket.split('/')[1],
        };
        exchangeID = dbExchanges[i]._id;
      }
    }

    let markets = [];
    let dbMarkets = await $http.$get(`/get-db-markets?exchange=${exchangeID}`);

    for (let i = 0; i < dbMarkets.length; i++) {
      markets.push(`${dbMarkets[i].baseAsset}/${dbMarkets[i].quoteAsset}`);
      if (`${dbMarkets[i].baseAsset}/${dbMarkets[i].quoteAsset}` === activeMarket.symbol) {
        activeMarket.type = dbMarkets[i].type;
      }
    }




    return {
      exchanges,
      activeExchange,
      markets,
      activeMarket,
    };
  },
  methods: {

  },
  mounted: async function () {

  }
}


</script>
