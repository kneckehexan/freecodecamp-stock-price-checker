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

    if (like){
      const ip = req.socket.remoteAddress; // Get users IP.
      const stockInDB = await Stock.findOne({stock: stock}); // See if stock is in our db.
      var foundLiked = false;
      if(!stockInDB) {
        await Stock.create({stock: stock, ip: [await hashIP(ip)]}); // If no stock in db, create it, add user's ip but hashed.
      } else {
        for(i = 0; i < stockInDB.ip.length; i++){
          if (bcrypt.compare(ip, stockInDB.ip[i])){
            continue;
          } else {
            foundLiked = true;
            break;
          }
        }
        if (!foundLiked) {
          var iph = await hashIP(ip)
          await stockInDB.ip.push(iph);
        }
      }
    }
    const likes = await Stock.find({stock: stock});
    console.log(likes);
    var like = 0;
    if (likes){
      like = likes[0].ip.length;
    }
    console.log(likes)
    return res.json({stockData: {stock: stock, price: price, likes: like}});
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