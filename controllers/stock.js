const IP = require('../models/IP');
const superagent = require('superagent');

const getStock = async (req, res) => {
  const {stock, like} = req.query;
  //console.log(`stock1: ${stock}\nlike: ${like}`)
  if (stock){
    const stockData = await stockPriceChecker(stock);
    if(!stockData){
      return res.json({error: "no stock by that name"});
    }
    var price = JSON.parse(stockData.text).latestPrice;
    return res.json({stockData: {stock: stock, price: price}});
  }
}


const stockPriceChecker = async (stock) => {
  try{
    var url = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + stock + '/quote';
    return await superagent.get(url)
  } catch(e) {
    console.error(e);
  }
}

module.exports = {
  getStock
}