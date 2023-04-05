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
  async function init(name) {
    this.name = name;
    this.instance = await this.getInstance();
  };

  async function  addDbExchange(exchange, apiKeys, defaultMarket){
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

  async function getDbExchanges(){
    return ExchangeModel.find({});
  };

  async function getDbMarkets(id){
    return MarketModel.find({exchangeID:id});
  };

  async function deleteDbExchange(id){
    await ExchangeModel.findByIdAndDelete(id);
    await MarketModel.deleteMany({exchangeId:id});
  };

  async function editDbExchange(exchange){
    return ExchangeModel.findOne({exchange});
  };

  async function updateDbExchange(exchange, apiKeys, defaultMarket){
    await ExchangeModel.updateOne({ exchange }, { apiKeys, defaultMarket });
  };

  async function  changeTerminalSymbol(exchange, symbol){
    await ExchangeModel.updateOne({ exchange }, { defaultMarket:symbol });
  };

  async function changeTerminalExchange(exchange){
    await ExchangeModel.updateMany({}, { isActive:false });
    await ExchangeModel.updateOne({ exchange:exchange }, { isActive:true });
  };

  async function  getInstance() {
    let keys = await this.getApiKey(this.name);
    let instance = await new ccxt[this.name] (keys);
    await instance.loadMarkets();
    instance.enableRateLimit = true;
    return instance;
  };

  async function getApiKey(exchange) {
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

  async function  createOrder(symbol, type, side, amount, price, params = {}) {
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

  async function cancelOrder(id, symbol){
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

  async function fetchOrder(id, symbol){
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

  async function fetchOpenOrders(symbol){
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

  async function fetchClosedOrders(symbol){
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

  async function  fetchOrderBook(symbol) {
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

  async function fetchTicker(symbol) {
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

  async function fetchOHLCV(symbol, timeframe) {
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

  async function fetchMarkets() {
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

  async function fetchMarketsNoKey(exchange) {
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

  async function fetchExchanges(){
    return ccxt.exchanges;
  };

  async function fetchBalance() {
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

  async function setLeverage(leverage, symbol){
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




  async function updateGrid(grid, price, side) {
    let newPrice = price;
    let newSide = side;
    let newAmount = grid.amount;
  
    if (side === 'buy' || side === 'BUY') {
      newPrice = math.evaluate(`${price} + ${gridWidth}`);
      newPrice *= 1.0033;
      newSide = 'sell';
    }
  
    if (side === 'sell' || side === 'SELL') {
      newPrice = math.evaluate(`${price} - ${gridWidth}`);
      newPrice /= 1.0055;
      newSide = 'buy';
    }
  
    newAmount = math.evaluate(`${grid.amount} / ${newPrice}`);
  
    if (newSide === 'sell') {
      newAmount *= 1.002;
    } else if (newSide === 'buy') {
      newAmount *= 1.0033;
    }
  
    grid.price = newPrice;
    grid.amount = newAmount;
    grid.side = newSide;
    return grid;
  }


  async function  createGridOrders(name, exchange, symbol, lowerPrice, upperPrice, amountType, amount, nrOfGrids, ordersSide, incrementalPercent,deviationPercent,newPrice,newSide,newAmount) {
    let prices = [];
    let gridWidth = math.evaluate(`(${upperPrice} - ${lowerPrice}) / ${nrOfGrids}`);
    let currentPrice = lowerPrice;
    let orders = [];


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
            amount: orderResponse.order.amount

            


            
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
      for (let i = 0; i < sellPrices.length; i++) {
        let log = null;
        let price = sellPrices[i];
        quantityPerGrid = await this.getQuantityPerGrid(price, amountType, amount, nrOfGrids, incrementalPercent, localSellIndex);

        let orderResponse = await this.createOrder(symbol, 'limit', 'sell', quantityPerGrid, price);
        let gridtotal = quantityPerGrid * 1;
        let gridtotalX = quantityPerGrid * price;
        sumX += gridtotalX;
        sum += gridtotal;
        let gridOrder = null;
        if (orderResponse.success) {
          orders.push({
            id:orderResponse.order.id,
            price: orderResponse.order.price,
            side: orderResponse.order.side,
            amount: orderResponse.order.amount
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
      for (let i = buyPrices.length - 1; i > 0; i--) {
        let log = null;
        let price = buyPrices[i];
        quantityPerGrid = await this.getQuantityPerGrid(price, amountType, amount, nrOfGrids, incrementalPercent, localBuyIndex);

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
            amount: orderResponse.order.amount
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
      for (let i = 0; i < sellPrices.length; i++) {
        let log = null;
        let price = sellPrices[i];
        quantityPerGrid = await this.getQuantityPerGrid(price, amountType, amount, nrOfGrids, incrementalPercent, localSellIndex);

        let orderResponse = await this.createOrder(symbol, 'limit', 'sell', quantityPerGrid, price);
        let gridtotal = quantityPerGrid * 1;
        let gridtotalX = quantityPerGrid * price;
        sumX += gridtotalX;
        sum += gridtotal;

        if (orderResponse.success) {
          orders.push({
            id: orderResponse.order.id,
            price: orderResponse.order.price,
            side: orderResponse.order.side,
            amount: orderResponse.order.amount

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

  async function getQuantityPerGrid(price, amountType, amount, nrOfGrids, incrementalPercent, index){
    let quantityPerGrid = null;

    if (amountType === 'quantityPerGrid') {
      quantityPerGrid = math.evaluate(`(${amount} + ((${amount} / 100) * (${incrementalPercent} * ${index}))) / ${price}`);
    }

    if (amountType === 'totalAmount') {
      quantityPerGrid = math.evaluate(`((${amount} / ${nrOfGrids}) + ((${amount} / ${nrOfGrids}) * (${incrementalPercent} * ${index}))) / ${price}`);
    }

    return quantityPerGrid;
  }

 

  async function getGridOrders() {
    return GridOrdersModel.find({});
  }

  async function deleteGridOrders(id) {

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
