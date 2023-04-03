const math = create(all, config);

const GridOrdersEngine = {
  start: async function() {
    console.log('Starting Grid Engine!');

    setIntervalAsync(async () => {

      // get running bots
      let runningGrids = await GridOrdersModel.find({});
      for (const grid of runningGrids) {

        let exchange = grid.exchange;
        let instance = new Exchange();
        await instance.init(exchange);

        let profits = {};
        let numBuyGridsHonored = 0;
        let totalBoughtQuantityForBuy = 0;
        let totalBoughtPriceForBuy = 0;
        let numSellGridsHonored = 0;
        let totalBoughtQuantityForSell = 0;
        let totalBoughtPriceForSell = 0;

        for (let index = 0; index < grid.orders.length; index++) {
          const gridOrder = grid.orders[index];

          let orderResponse = await instance.fetchOrder(gridOrder.id, grid.symbol);

          if(orderResponse.success) {
            let status = orderResponse.order['info']['status'];
            let side = orderResponse.order['info']['side'];
            let price = orderResponse.order['info']['price'];
            let newSide = false;

            if(status === 'done' || status === 'closed' || status === 'FILLED') {
              let gridWidth = math.evaluate(`(${grid.upperPrice} - ${grid.lowerPrice}) / ${grid.nrOfGrids}`);

              if(side === 'buy' || side === 'BUY') {
                newPrice = math.evaluate(`${price} + ${gridWidth}`);
                newPrice *= 1.003;
                newSide = 'sell';
              }

              if(side === 'sell' || side === 'SELL') {
                newPrice = math.evaluate(`${price} - ${gridWidth}`);
                newPrice *= 1.003;
                newSide = 'buy';
              }

              let newAmount = math.evaluate(`${grid.amount} / ${newPrice}`);
              newAmount *= 1.11;

              let newOrderResponse = await instance.createOrder(grid.symbol, 'limit', newSide, newAmount, newPrice, false);

              console.log(grid.symbol, price ,side, 'oldpriceside', '📗📕---->', 'limit', newAmount,'newpriceside',newSide, newPrice,'📗📕', false);

              if(newOrderResponse.success) {
                let currentSide = grid.orders[2*index].side;
                let buyOrderId = grid.orders[2*index].id;
                let sellOrderId = grid.orders[2*index+1].id;

                let buyOrderResponse = await instance.fetchOrder(buyOrderId, grid.symbol);
                let sellOrderResponse = await instance.fetchOrder(sellOrderId, grid.symbol);

                if (buyOrderResponse.success && sellOrderResponse.success) {
                  let buyPrice = buyOrderResponse.order.info.price;
                  let sellPrice = sellOrderResponse.order.info.price;
                  let quantity = grid.amount / buyPrice;

                  let profit = (sellPrice - buyPrice) * quantity;

                  if (currentSide === 'buy') {
                    numBuyGridsHonored++;
                    totalBoughtQuantityForBuy += quantity;
                    totalBoughtPriceForBuy += buyPrice;
                  } else if (currentSide === 'sell') {
                    numSellGridsHonored++;
                    totalBoughtQuantityForSell += quantity;
                    totalBoughtPriceForSell += buyPrice;
                  }

                  if (profit > 0) {
                    if (!profits.hasOwnProperty(grid.symbol)) {
                      profits[grid.symbol] = 0;
                    }
                    profits[grid.symbol] += profit;
                  }
                } else {
                  console.log(`Error fetching order info for grid ${index} of ${grid.symbol}`);
                }
              } else {
                console.log(newOrderResponse.log);
              }
            }
          } else {
            console.log(orderResponse.log);
          }
        }

        if (numBuyGridsHonored > 0) {
          let avgBuyPrice = totalBoughtPriceForBuy / numBuyGridsHonored;
          let totalBoughtQuantityForBuyFormatted = totalBoughtQuantityForBuy.toFixed(2);
          console.log(`${numBuyGridsHonored} buy grids honored for ${grid.symbol} with an average buy price of ${avgBuyPrice.toFixed(2)} and a total bought quantity of ${totalBoughtQuantityForBuyFormatted}`);
        }

        if (numSellGridsHonored > 0) {
          let avgSellPrice = totalBoughtPriceForSell / numSellGridsHonored;
          let totalBoughtQuantityForSellFormatted = totalBoughtQuantityForSell.toFixed(2);
          console.log(`${numSellGridsHonored} sell grids honored for ${grid.symbol} with an average sell price of ${avgSellPrice.toFixed(2)} and a total bought quantity of ${totalBoughtQuantityForSellFormatted}`);
        }

        for (let symbol in profits) {
          if (profits.hasOwnProperty(symbol)) {
            console.log(`Profit for ${symbol}: ${profits[symbol].toFixed(2)}`);
          }
        }

      }

      //check running deals
    let runningDeals = await DCADealModel.find({isActive: true});
    for (const deal of runningDeals) {
      let exchange = deal.exchange;
      let instance = new Exchange();
      await instance.init(exchange);

      let ticker = await instance.fetchTicker(deal.symbol);
      let price = ticker.last;
      let direction = deal.direction;
      let distance = deal.distance;
      let boughtPrice = deal.boughtPrice;
      let boughtQuantity = deal.boughtQuantity;
      let stopLoss = deal.stopLoss;

      if (direction === 'up' && price >= boughtPrice + distance) {
        console.log(`DCA Deal reached target price of ${boughtPrice+distance} for ${deal.symbol}!`);
        let sellAmount = boughtQuantity;
        let sellPrice = price * 0.998;

        let sellOrderResponse = await instance.createOrder(deal.symbol, 'limit', 'sell', sellAmount, sellPrice, false);
        if (sellOrderResponse.success) {
          await DCADealModel.updateOne({_id: deal._id}, {isActive: false});
          console.log(`Sell order created for ${deal.symbol} at ${sellPrice}`);
        } else {
          console.log(sellOrderResponse.log);
        }
      } else if (direction === 'down' && price <= boughtPrice - distance) {
        console.log(`DCA Deal reached target price of ${boughtPrice-distance} for ${deal.symbol}!`);
        let sellAmount = boughtQuantity;
        let sellPrice = price * 1.002;

        let sellOrderResponse = await instance.createOrder(deal.symbol, 'limit', 'sell', sellAmount, sellPrice, false);
        if (sellOrderResponse.success) {
          await DCADealModel.updateOne({_id: deal._id}, {isActive: false});
          console.log(`Sell order created for ${deal.symbol} at ${sellPrice}`);
        } else {
          console.log(sellOrderResponse.log);
          
        } else {
            console.log(`Error fetching order info for grid ${index} of ${grid.symbol}`);
          }
        } else {
          console.log(`Error fetching order info for grid ${index} of ${grid.symbol}`);
        }
      } else {
        console.log(newOrderResponse.log);
      }
    }
  } else {
    console.log(orderResponse.log);
  }
}

if (numBuyGridsHonored > 0) {
  let avgBuyPrice = totalBoughtPriceForBuy / numBuyGridsHonored;
  let totalBoughtQuantityForBuyFormatted = totalBoughtQuantityForBuy.toFixed(2);
  console.log(`${numBuyGridsHonored} buy grids honored for ${grid.symbol} with an average buy price of ${avgBuyPrice.toFixed(2)} and a total bought quantity of ${totalBoughtQuantityForBuyFormatted}`);
}

if (numSellGridsHonored > 0) {
  let avgSellPrice = totalBoughtPriceForSell / numSellGridsHonored;
  let totalBoughtQuantityForSellFormatted = totalBoughtQuantityForSell.toFixed(2);
  console.log(`${numSellGridsHonored} sell grids honored for ${grid.symbol} with an average sell price of ${avgSellPrice.toFixed(2)} and a total bought quantity of ${totalBoughtQuantityForSellFormatted}`);
}

for (let symbol in profits) {
  if (profits.hasOwnProperty(symbol)) {
    console.log(`Profit for ${symbol}: ${profits[symbol].toFixed(2)}`);
  }
}

}

// check open positions
let openPositions = await instance.fetchOpenPositions();

if (openPositions.success) {
for (let position of openPositions.positions) {
  let symbol = position.symbol;
  let positionSize = position.positionSize;
  let unrealizedPnl = position.unrealizedPnl;

  console.log(`Open position for ${symbol}: size = ${positionSize}, unrealized PnL = ${unrealizedPnl}`);
}
} else {
console.log(openPositions.log);
}

}, 5000);
},
}

module.exports = GridOrdersEngine;
