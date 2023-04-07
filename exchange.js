const ExchangeModel = require("../../models/ExchangeModel");
const MarketModel = require("../../models/MarketModel");
const GridOrdersModel = require('../../models/GridOrdersModel');

const ccxt = require("../ccxt/ccxt");
const { create, all } = require('mathjs');
const moment = require("moment/moment");

const config = {
  number: 'BigNumber',
  precision: 20
}
const math = create(all, config);

class Exchange {
  async init(name) {
    this.name = name;
    this.instance = await this.getInstance();
  };

  async addDbExchange(exchange, apiKeys, defaultMarket){
    let dbInstance = new ExchangeModel({
      exchange,
      apiKeys,
      defaultMarket,
      isActive: true,
    });
    let dbExchange = await dbInstance.save();

    await this.init(exchange);
    let status = await this.fetchMarkets();

    if (status.success) {
      for (let i = 0; i < status.markets.length; i++) {
        let market = status.markets[i];
        let data = {
          type:market.type,
          baseAsset:market.base,
          quoteAsset:market.quote,
          exchangeID:dbExchange._id,
        };
        let dbInstance = new MarketModel(data);
        let response = await dbInstance.save();
      }
      return dbExchange;
    } else {
      console.log(status.log);
    }
  };

  async getDbExchanges(){
    return ExchangeModel.find({});
  };

  async getDbMarkets(id){
    return MarketModel.find({exchangeID:id});
  };

  async deleteDbExchange(id){
    await ExchangeModel.findByIdAndDelete(id);
    await MarketModel.deleteMany({exchangeId:id});
  };

  async editDbExchange(exchange){
    return ExchangeModel.findOne({exchange});
  };

  async updateDbExchange(exchange, apiKeys, defaultMarket){
    await ExchangeModel.updateOne({ exchange }, { apiKeys, defaultMarket });
  };

  async changeTerminalSymbol(exchange, symbol){
    await ExchangeModel.updateOne({ exchange }, { defaultMarket:symbol });
  };

  async changeTerminalExchange(exchange){
    await ExchangeModel.updateMany({}, { isActive:false });
    await ExchangeModel.updateOne({ exchange:exchange }, { isActive:true });
  };

  async getInstance() {
    let keys = await this.getApiKey(this.name);
    let instance = await new ccxt[this.name] (keys);
    await instance.loadMarkets();
    instance.enableRateLimit = true;
    return instance;
  };

  async getApiKey(exchange) {
    let returnObj = [];
    let exchangeData = await ExchangeModel.findOne({
      exchange: exchange
    });

    if (typeof exchangeData !== 'undefined') {
      for (let i = 0; i < exchangeData.apiKeys.length; i++) {
        returnObj[exchangeData.apiKeys[i].key] = exchangeData.apiKeys[i].value;
      }
      return returnObj;
    } else {
      return false;
    }
  };

  async createOrder(symbol, type, side, amount, price, params = {}) {
    let log = null;
    let order = null;
    let success = null;

    // console.log(symbol, type, side, amount, price, params);

    try {
      if (type === 'oco') {
        order = await this.instance.privatePostOrderOco({
          'symbol': symbol.split('/').join(''),
          'quantity': this.instance.amountToPrecision(symbol, amount),
          'side': side,
          'price': this.instance.priceToPrecision(symbol, params.tpPrice),
          'stopPrice': this.instance.priceToPrecision(symbol, params.stopLossPrice),
          'stopLimitPrice': this.instance.priceToPrecision(symbol, params.stopLimitPrice),
          'stopLimitTimeInForce': 'GTC',
        });
      }

      if (type === 'limit' || type === 'take_profit_limit' || type === 'take_profit') {
        order = await this.instance.createOrder(
          symbol,
          type,
          side,
          this.instance.amountToPrecision(symbol, amount),
          this.instance.priceToPrecision(symbol, price),
          params
        );
      }

      if (type === 'market') {
        order = await this.instance.createOrder(
          symbol,
          type,
          side,
          this.instance.amountToPrecision(symbol, amount),
        );
      }
      success = true;
    } catch (e) {
      order = null;
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }

    return {
      order,
      success,
      log
    };
  };

  async cancelOrder(id, symbol){
    let log = null;
    let order = null;
    let success = null;

    try {
      order = await this.instance.cancelOrder(id, symbol);
      success = true;
    } catch (e) {
      order = null;
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }

    return {
      order,
      success,
      log
    };
  };

  async fetchOrder(id, symbol){
    let log = null;
    let order = null;
    let success = null;

    try {
      order = await this.instance.fetchOrder(id, symbol);
      success = true;
    } catch (e) {
      order = null;
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }

    return {
      order,
      success,
      log
    };
  };

  async fetchOpenOrders(symbol){
    let log = null;
    let orders = null;
    let success = null;

    try {
      orders = await this.instance.fetchOpenOrders(symbol);
      success = true;
    } catch (e) {
      orders = null;
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }

    return {
      orders,
      success,
      log
    };
  };

  async fetchClosedOrders(symbol){
    let log = null;
    let orders = null;
    let success = null;

    try {
      orders = await this.instance.fetchClosedOrders(symbol);
      success = true;
    } catch (e) {
      orders = null;
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }

    return {
      orders,
      success,
      log
    };
  };

  async fetchOrderBook(symbol) {
    let log = null;
    let orderBook = null;
    let success = null;

    try {
      orderBook = await this.instance.fetchOrderBook(symbol);
      success = true;
    } catch (e) {
      orderBook = null;
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }

    return {
      orderBook,
      success,
      log
    };
  };

  async fetchTicker(symbol) {
    let log = null;
    let ticker = null;
    let success = null;

    try {
      ticker = await this.instance.fetchTicker(symbol);
      success = true;
    } catch (e) {
      ticker = null;
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }

    return {
      ticker,
      success,
      log
    };
  };

  async fetchOHLCV(symbol, timeframe) {
    let log = null;
    let ohlcv = null;
    let success = null;

    try {
      ohlcv = await this.instance.fetchOHLCV(symbol, timeframe);
      success = true;
    } catch (e) {
      ohlcv = null;
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }

    return {
      ohlcv,
      success,
      log
    };
  };

  async fetchMarkets() {
    let log = null;
    let markets = null;
    let success = null;

    try {
      markets = await this.instance.fetchMarkets();
      success = true;
    } catch (e) {
      markets = null;
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }

    return {
      markets,
      success,
      log
    };
  };

  async fetchMarketsNoKey(exchange) {
    let log = null;
    let markets = null;
    let success = null;

    let instance = await new ccxt[exchange] ();
    await instance.loadMarkets();

    try {
      markets = await instance.fetchMarkets();
      success = true;
    } catch (e) {
      markets = null;
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }

    return {
      markets,
      success,
      log
    };
  };

  async fetchExchanges(){
    return ccxt.exchanges;
  };

  async fetchBalance() {
    let log = null;
    let balance = null;
    let success = null;

    try {
      balance = await this.instance.fetchBalance();
      success = true;
    } catch (e) {
      balance = null;
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }

    return {
      balance,
      success,
      log
    };
  };

  async setLeverage(leverage, symbol){
    let log = null;
    let success = null;
    try {
      await this.instance.setLeverage(leverage, symbol);
      success = true;
    } catch (e) {
      success = false;
      if (e instanceof ccxt.NetworkError) {
        log =`Failed due to a network error: ${e.message}`;
      } else if (e instanceof ccxt.ExchangeError) {
        log =`Failed due to a exchange error: ${e.message}`;
      } else {
        log =`Failed with: ${e.message}`;
      }
    }
    return {
      success,
      log
    };
  };

  async createGridOrders(name, exchange, symbol, lowerPrice, upperPrice, amountType, amount, nrOfGrids, ordersSide, incrementalPercent, ) {
    let prices = [];
    let gridWidth = math.evaluate(`(${upperPrice} - ${lowerPrice}) / ${nrOfGrids}`);
    let currentPrice = lowerPrice;
    let orders = [];
    let totalProfitBuy = 0; // variabila globala pentru profitul total pentru buy
    let totalProfitSell = 0; // variabila globala pentru profitul total pentru sell
    
    for (let i = 0; i < nrOfGrids; i++) {
      currentPrice = math.evaluate(`${currentPrice} + ${gridWidth}`);
      prices.push(currentPrice);
    }

    let status = await this.fetchTicker(symbol);
    let lastPrice = status.ticker.last;
    let quantityPerGrid = null;

    let sellPrices = [];
    for (let i = 0; i < prices.length; i++) {
      if (prices[i] > lastPrice) {
        sellPrices.push(prices[i]);
      }
    }

    let buyPrices = [];
    for (let i = 0; i < prices.length; i++) {
      if (prices[i] < lastPrice) {
        buyPrices.push(prices[i]);
      }
    }

    if (ordersSide === 'buyOrSell') {

      //buy
      
      let sum = 0;
      let sumX = 0;
      
      let localBuyIndex = 1;
      
      for (let i = buyPrices.length - 1; i > 0; i--) {
        let log = null;
        let price = buyPrices[i];
        quantityPerGrid = await this.getQuantityPerGrid(price, amountType, amount, nrOfGrids, incrementalPercent, localBuyIndex);
        let newPrice, newAmount, newSide,profitUSD,profitFISE;
        newPrice = price * (1 + incrementalPercent/100);
        newAmount = quantityPerGrid 
        newSide = 'sell';
        let difBUY=newPrice-price;
        let difSELL=price-newPrice;
        let ProfitBuy=difBUY * newAmount;
        let ProfitFISEBUY=quantityPerGrid - newAmount;
        
        totalProfitBuy += difBUY * newAmount; // actualizam profitul total pentru buy

        let orderResponse = await this.createOrder(symbol, 'limit', 'buy', quantityPerGrid, price);
        let gridtotal = quantityPerGrid * 1;
        let gridtotalX = quantityPerGrid * price;
        sumX += gridtotalX;
        sum += gridtotal;

        if (orderResponse.success) {
          orders.push({
            id: orderResponse.order.id,
            price: orderResponse.order.price,
            side: orderResponse.order.side,
            amount: orderResponse.order.amount,
            newAmount: orderResponse.order.amount,
            newSide: newSide,
            newPrice: newPrice,
            Profit: ProfitBuy,
            ProfitFISE: ProfitFISEBUY,
            data: {
              name: this.gridName,
              exchange: this.exchange,
              
              lowerPrice: this.lowerPrice,
              upperPrice: this.upperPrice,
              amountType: this.amountType,
              amount: this.amount,
              nrOfGrids: this.nrOfGrids,
              ordersSide: this.ordersSide,
              incrementalPercent: this.incrementalPercent,
              tierCount: this.tierCount,
              fieldSets: this.fieldSets.map(field => ({
                ...field,
                DeviationPRICEBuy: field.DeviationPRICEBuy === null ? null : Number(field.DeviationPRICEBuy),
                DeviationPRICESell: field.DeviationPRICESell === null ? null : Number(field.DeviationPRICESell),
                DeviationAMOUNTBuy: field.DeviationAMOUNTBuy === null ? null : Number(field.DeviationAMOUNTBuy),
                DeviationAMOUNTSell: field.DeviationAMOUNTSell === null ? null : Number(field.DeviationAMOUNTSell)
              })),
              fieldSets2: this.fieldSets2.map(field => ({
                ...field,
                new: field.new === null ? null : Number(field.new),
                old: field.old === null ? null : Number(field.old),
                balance: field.balance === null ? null : Number(field.balance),
                rsi: field.rsi === null ? null : Number(field.rsi),
                macd: field.macd === null ? null : Number(field.macd),
                price: field.price === null ? null : Number(field.price),
                fiblev: field.fiblev === null ? null : Number(field.fiblev),
                lowerPrice: field.lowerPrice === null ? null : Number(field.lowerPrice),
                upperPrice: field.upperPrice === null ? null : Number(field.upperPrice),
                fibdowntrend: field.fibdowntrend === null ? null : Number(field.fibdowntrend),
                fibuptrend: field.fibuptrend === null ? null : Number(field.fibuptrend)
              }))
            }
          });
          log =`${this.getCurrentTime()}: ${symbol} - PLACING_GRID_ORDER - Type: limit, Side: buy, Amount: ${quantityPerGrid}, Price: ${price}, Total:${gridtotal} `;
        }

        if (!orderResponse.success) {
          log =`${this.getCurrentTime()}: ${symbol} - PLACING_GRID_ORDER - ${orderResponse.log}`;
        }

        console.log(log);
        localBuyIndex++;
      }
      let SUMBUYX = sumX ;
      let SUMBUY = sum ;
      let average= sumX / sum;

      console.log(`📗total fise Buy: ${SUMBUY}`);
      console.log(`📘total usd Buy: ${SUMBUYX}`);
      console.log(`📕average price ${symbol} Buy: ${average}`);
      console.log(`📔nr ordere: ${nrOfGrids}`);
      console.log(`📔increment : ${incrementalPercent} % `);
      //console.log(`📔increment : ${deviationPercent} % `);
      //console.log(`📔increment : ${deviationGRIDno} no `);

      //sell
      sum = 0;
      sumX = 0;
      let localSellIndex = 1;
        let newPrice, newAmount, newSide;
      for (let i = 0; i < sellPrices.length; i++) {
        let log = null;
        let price = sellPrices[i];
        quantityPerGrid = await this.getQuantityPerGrid(price, amountType, amount, nrOfGrids, incrementalPercent, localSellIndex);
        newPrice = price / (1 + incrementalPercent/100);
        newAmount = quantityPerGrid 
        newSide = 'buy';
        let difBUY=newPrice-price;
        let difSELL=price-newPrice;
        let ProfitSELL=difSELL * newAmount;
        let ProfitFISESELL=quantityPerGrid - newAmount;


        let orderResponse = await this.createOrder(symbol, 'limit', 'sell', quantityPerGrid, price);
        let gridtotal = quantityPerGrid * 1;
        let gridtotalX = quantityPerGrid * price;
        sumX += gridtotalX;
        sum += gridtotal;
        let gridOrder = null;
        if (orderResponse.success) {
          orders.push({
            id: orderResponse.order.id,
            price: orderResponse.order.price,
            side: orderResponse.order.side,
            amount: orderResponse.order.amount,
            newAmount: orderResponse.order.amount,
            newSide: newSide,
            newPrice: newPrice,
          
            data: {
              name: this.gridName,
              exchange: this.exchange,
              
              lowerPrice: this.lowerPrice,
              upperPrice: this.upperPrice,
              amountType: this.amountType,
              amount: this.amount,
              nrOfGrids: this.nrOfGrids,
              ordersSide: this.ordersSide,
              incrementalPercent: this.incrementalPercent,
              tierCount: this.tierCount,
              fieldSets: this.fieldSets.map(field => ({
                ...field,
                DeviationPRICEBuy: field.DeviationPRICEBuy === null ? null : Number(field.DeviationPRICEBuy),
                DeviationPRICESell: field.DeviationPRICESell === null ? null : Number(field.DeviationPRICESell),
                DeviationAMOUNTBuy: field.DeviationAMOUNTBuy === null ? null : Number(field.DeviationAMOUNTBuy),
                DeviationAMOUNTSell: field.DeviationAMOUNTSell === null ? null : Number(field.DeviationAMOUNTSell)
              })),
              fieldSets2: this.fieldSets2.map(field => ({
                ...field,
                new: field.new === null ? null : Number(field.new),
                old: field.old === null ? null : Number(field.old),
                balance: field.balance === null ? null : Number(field.balance),
                rsi: field.rsi === null ? null : Number(field.rsi),
                macd: field.macd === null ? null : Number(field.macd),
                price: field.price === null ? null : Number(field.price),
                fiblev: field.fiblev === null ? null : Number(field.fiblev),
                lowerPrice: field.lowerPrice === null ? null : Number(field.lowerPrice),
                upperPrice: field.upperPrice === null ? null : Number(field.upperPrice),
                fibdowntrend: field.fibdowntrend === null ? null : Number(field.fibdowntrend),
                fibuptrend: field.fibuptrend === null ? null : Number(field.fibuptrend)
              }))
            }
          });
          log =`${this.getCurrentTime()}: ${symbol} - PLACING_GRID_ORDER - Type: limit, Side: sell, Amount: ${quantityPerGrid}, Price: ${price}`;
        }

        if (!orderResponse.success) {
          gridOrder = null;
          log =`${this.getCurrentTime()}: ${symbol} - PLACING_GRID_ORDER - ${orderResponse.log}`;
        }

        console.log(log);
        localSellIndex++;
      }
      let SUMSELLX = sumX ;
      let SUMBSELL = sum ;
      average= sumX / sum;
      console.log(`📗total fise SELL: ${SUMBSELL}`);
      console.log(`📘total usd SELL: ${SUMSELLX}`);
      console.log(`📕average price ${symbol} SELL: ${average}`);
      console.log(`📔nr ordere: ${nrOfGrids}`);
      console.log(`📔increment : ${incrementalPercent} % `);
      
    }


    if (ordersSide === 'buyOnly') {
      //buy
      let sum = 0;
      let sumX = 0;
      let localBuyIndex = 1;
      let newPrice, newAmount, newSide;
      for (let i = buyPrices.length - 1; i > 0; i--) {
        let log = null;
        let price = buyPrices[i];
        quantityPerGrid = await this.getQuantityPerGrid(price, amountType, amount, nrOfGrids, incrementalPercent, localBuyIndex);
        newPrice = price * (1 + incrementalPercent/100);
        newAmount = quantityPerGrid 
        newSide = 'sell';

        let orderResponse = await this.createOrder(symbol, 'limit', 'buy', quantityPerGrid, price);
        let gridtotal = quantityPerGrid * 1;
        let gridtotalX = quantityPerGrid * price;
        sumX += gridtotalX;
        sum += gridtotal;



        if (orderResponse.success) {
          orders.push({
            id:orderResponse.order.id,
            price: orderResponse.order.price,
            side: orderResponse.order.side,
            amount: orderResponse.order.amount,
            newAmount: newAmount,
            newSide: newSide,
            newPrice: newPrice,

          });
          log =`${this.getCurrentTime()}: ${symbol} - PLACING_GRID_ORDER - Type: limit, Side: buy, Amount: ${quantityPerGrid}, Price: ${price}, Total:${gridtotal} `;
        }

        if (!orderResponse.success) {
          log =`${this.getCurrentTime()}: ${symbol} - PLACING_GRID_ORDER - ${orderResponse.log}`;
        }

        console.log(log);
        localBuyIndex++;
      }
      let SUMBUYX = sumX ;
      let SUMBUY = sum ;
      let average= sumX / sum;

      console.log(`📗total fise Buy: ${SUMBUY}`);
      console.log(`📘total usd Buy: ${SUMBUYX}`);
      console.log(`📕average price ${symbol} Buy: ${average}`);
      console.log(`📔nr ordere: ${nrOfGrids}`);
      console.log(`📔increment : ${incrementalPercent} % `);

    }

    if (ordersSide === 'sellOnly')  {
      //sell
      let sum = 0;
      let sumX = 0;
      let localSellIndex = 1;
      let newPrice, newAmount, newSide;
      for (let i = 0; i < sellPrices.length; i++) {
        let log = null;
        let price = sellPrices[i];
        

        quantityPerGrid = await this.getQuantityPerGrid(price, amountType, amount, nrOfGrids, incrementalPercent, localSellIndex);
        newPrice = price * (1 - incrementalPercent/100);
       newAmount = quantityPerGrid 
        newSide = 'buy';



        let orderResponse = await this.createOrder(symbol, 'limit', 'sell', quantityPerGrid, price, newSide, newAmount, newPrice);
        let gridtotal = quantityPerGrid * 1;
        let gridtotalX = quantityPerGrid * price;
        sumX += gridtotalX;
        sum += gridtotal;

        if (orderResponse.success) {
          orders.push({
            id: orderResponse.order.id,
            price: orderResponse.order.price,
            side: orderResponse.order.side,
            amount: orderResponse.order.amount,
            newAmount: newAmount,
            newSide: newSide,
            newPrice: newPrice,

          });
          log =`${this.getCurrentTime()}: ${symbol} - PLACING_GRID_ORDER - Type: limit, Side: sell, Amount: ${quantityPerGrid}, Price: ${price}`;
        }

        if (!orderResponse.success) {
          log =`${this.getCurrentTime()}: ${symbol} - PLACING_GRID_ORDER - ${orderResponse.log}`;
        }

        console.log(log);
        localSellIndex++;
      }
      let SUMSELLX = sumX ;
      let SUMBSELL = sum ;
      let average= sumX / sum;
      console.log(`📗total fise SELL: ${SUMBSELL}`);
      console.log(`📘total usd SELL: ${SUMSELLX}`);
      console.log(`📕average price ${symbol} SELL: ${average}`);
      console.log(`📔nr ordere: ${nrOfGrids}`);
      console.log(`📔increment : ${incrementalPercent} % `);

    }

    //save to db
    const user = new GridOrdersModel({
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
      orders
    });
    await user.save();

  };

  async getQuantityPerGrid(price, amountType, amount, nrOfGrids, incrementalPercent, index){
    let quantityPerGrid = null;

    if (amountType === 'quantityPerGrid') {
      quantityPerGrid = math.evaluate(`(${amount} + ((${amount} / 100) * (${incrementalPercent} * ${index}))) / ${price}`);
    }

    if (amountType === 'totalAmount') {
      quantityPerGrid = math.evaluate(`((${amount} / ${nrOfGrids}) + ((${amount} / ${nrOfGrids}) * (${incrementalPercent} * ${index}))) / ${price}`);
    }

    return quantityPerGrid;
  }

  getCurrentTime() {
    return moment(new Date()).format('lll');
  }

  async getGridOrders() {
    return GridOrdersModel.find({});
  }

  async deleteGridOrders(id) {

    let gridOrders = await GridOrdersModel.findOne({id});

    if (gridOrders) {
      let errors = [];

      for (let i = 0; i < gridOrders.orders.length; i++) {
        let order = gridOrders.orders[i];

        let result = await this.cancelOrder(order.id, gridOrders.symbol);

        if (result.log) {
          errors.push(result.log);
        }
      }

      await GridOrdersModel.findByIdAndDelete(id);

      if (errors.length) {
        console.log(errors)
      }
    }
  };

};

module.exports = Exchange;
