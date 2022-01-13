const Stock = require('../models/Stock');
const superagent = require('superagent');
const bcrypt = require('bcrypt')

const getStock = async (req, res) => {
  var {stock, like} = req.query;
  stock = stock.toUpperCase(); // In order to keep some visual structure in the db.
  like = (like === 'true'); // req.query gives a string, which here is turned into bool.

  if (stock){
    const stockData = await stockPriceChecker(stock);
    if(!stockData){
      return res.json({error: "no stock by that name"});
    }
    
    var price = JSON.parse(stockData.text).latestPrice;

    var likes = 0;
    const ip = req.socket.remoteAddress;
    var foundIP = false;
    const stockInDB = await Stock.findOne({stock: stock});

    if (!stockInDB && like) { // Stock doesn't exist in DB but was liked: add it and set likes to 1.
      await Stock.create({stock: stock, ip: [await hashIP(ip)]});
      likes = 1;
    } else if (stockInDB && like) { // Stock does exist and was liked.
      var ipLength = stockInDB.ip.length;
      for (i = 0; i < ipLength; i++) {
        if (bcrypt.compare(ip, stockInDB.ip[i])) {
          foundIP = true;
          break;
        }
      }
      likes = ipLength;
      if (!foundIP) { // If user's ip doesn't exist, add it do db and add 1 to the likes.
        await stockInDB.ip.push([await hashIP(ip)]);
        likes += 1;
      }
    } else if (stockInDB && !like) { // If the stock exists but wasn't liked.
      likes = stockInDB.ip.length;
    }

    return res.json({stockData: {stock: stock, price: price, likes: likes}});
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

const hashIP = async (ip) => {
  return bcrypt.hash(ip, 10);
}

module.exports = {
  getStock
}