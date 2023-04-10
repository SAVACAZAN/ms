const {setIntervalAsync} = require("set-interval-async/fixed");
const GridOrdersModel = require("../../models/GridOrdersModel");
const Exchange = require('./exchange');
const {create, all} = require('mathjs');

const config = {
    number: 'BigNumber',
    precision: 20
}

const math = create(all, config);
let totalProfitBuy = 0; // variabila globala pentru profitul total pentru buy
let totalProfitSell = 0; // variabila globala pentru profitul total pentru sell


const GridOrdersEngine = {
    start: async function () {
        console.log('Starting Grid Engine!');

        setIntervalAsync(async () => { // get running bots
            let runningGrids = await GridOrdersModel.find({});
            for (const grid of runningGrids) {

                let exchange = grid.exchange;
                let instance = new Exchange();
                await instance.init(exchange);

                for (let index = 0; index < grid.orders.length; index++) {
                    const gridOrder = grid.orders[index];

                    let orderResponse = await instance.fetchOrder(gridOrder.id, grid.symbol);

                    if (orderResponse.success) {
                        let status = orderResponse.order['status'];
                        let side = orderResponse.order['side'];
                        let price = orderResponse.order['price'];
                        let amount = orderResponse.order['amount'];
                        let newSide = false;
                        let newAmount = false;

                        if (status === 'closed') { // let gridWidth = math.evaluate(`(${grid.upperPrice} - ${grid.lowerPrice}) / ${grid.nrOfGrids}`);

                            console.log(orderResponse.order);

                            if (side === 'buy') {

                                newPrice = math.evaluate(`${price} + ((${price} / 100) * ${
                                    grid.deviationPRICEBuy
                                })`);
                                newAmount = math.evaluate(`${amount} + ((${amount} / 100) * ${
                                    grid.deviationAMOUNTBuy
                                })`);
                                newSide = 'sell';
                            }

                            if (side === 'sell') {
                                newPrice = math.evaluate(`${price} - ((${price} / 100) * ${
                                    grid.deviationPRICESell
                                })`);
                                newAmount = math.evaluate(`${amount} + ((${amount} / 100) * ${
                                    grid.deviationAMOUNTSell
                                })`);
                                newSide = 'buy';
                            }

                            let difBUY = price - newPrice;
                            let difSELL = newPrice - price;

                            let newOrderResponse = await instance.createOrder(grid.symbol, 'limit', newSide, newAmount, newPrice, false);


                            console.log('▶️ \x1b[33m==>', grid.symbol, '\x1b[37m-->', price, '🛡️->', side, '👽 --->', newSide, newPrice, '✨<--', '<-✒️->', amount, '<-->', newAmount, '<-✒️->', '---->', 'limit', false);


                            if (newSide === 'buy') {
                                totalProfitBuy += difBUY * newAmount; // actualizam profitul total pentru buy
                                console.log(`Profit \x1b[32mfor 📗 ${newSide}: ${
                                    difBUY * newAmount
                                }\x1b[37m`);
                            } else if (newSide === 'sell') {
                                totalProfitSell += difSELL * newAmount; // actualizam profitul total pentru sell
                                console.log(`Profit \x1B[31for 📕${newSide}: ${
                                    difSELL * newAmount
                                }\x1b[37m`);
                            }


                            if (newOrderResponse.success) {

                                let newOrders = [];

                                for (let i = 0; i < grid.orders.length; i++) {
                                    if (i === index) {
                                        newOrders.push({
                                            id: newOrderResponse.order.id,
                                            price: newOrderResponse.order.price,
                                            side: newOrderResponse.order.side,
                                            amount: newOrderResponse.order.amount,
                                            newAmount: newOrderResponse.order.newAmount,
                                            newPrice: newOrderResponse.order.newPrice,
                                            newSide: newOrderResponse.order.newSide
                                        });
                                    } else {
                                        newOrders.push(grid.orders[i]);
                                    }
                                }

                                if (newSide === 'buy') {
                                    console.log(`✒️୧ ‧₊˚Tota୧ ‧₊˚profit for \x1b[32mbuy🟢: ${totalProfitBuy}\x1b[37m`);

                                } else if (newSide === 'sell') {
                                    console.log(`✒️୧ ‧₊˚Tota୧ ‧₊˚profit for \x1B[31msell🔴: ${totalProfitSell}\x1b[37m`);
                                }


                                await GridOrdersModel.updateOne({
                                    _id: grid._id
                                }, {orders: newOrders});
                            } else {
                                console.log(newOrderResponse.log);
                            }
                        }
                    } else {
                        console.log(orderResponse.log);
                    }
                }


            }

            // //check running deals
            // let runningDeals = await DCADealModel.find({isActive: true});


        }, 5000);

        let count = 0;

        setInterval(() => {
            console.log(`\x1b[33mCycle \x1b[34m${count}\x1b[37m: \x1b[35m✒️୧ ‧₊˚Tota୧\x1b[36m ‧₊˚\x1b[33mprofit \x1b[35mfor \x1b[32mbuy🟢: ${totalProfitBuy}\x1b[37m`);
            console.log(`\x1b[33mCycle \x1b[34m${count}\x1b[37m: \x1b[35m✒️୧ ‧₊˚Tota୧\x1b[36m ‧₊˚\x1b[33mprofit \x1b[35mfor \x1B[31msell🔴: ${totalProfitSell}\x1b[37m`);

            if (count === 1 || count % 10 === 1) {
                const now = new Date();
                const hours = '\x1b[33m' + now.getHours() + '\x1b[0m';
                const minutes = '\x1b[33m' + now.getMinutes() + '\x1b[0m';
                const seconds = '\x1b[33m' + now.getSeconds() + '\x1b[0m';
                console.log(`\x1b[31m${
                    now.toISOString().slice(0, 10)
                } \x1b[33m${hours}:\x1b[33m${minutes}:${seconds}\x1b[0m`);
            }

            count++;
        }, 6000);


    }
}


module.exports = GridOrdersEngine;
