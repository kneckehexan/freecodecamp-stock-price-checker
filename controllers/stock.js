const IP = require('../models/IP');
const http = require('http');

const getStock = async (req, res) => {
  const url = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/'
  const {stock1, stock2, check} = req.params;
  if (stock1 && !stock2){
    
  }
}

const stockPriceChecker = (stock) => {
  var options = {
    host: 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/',
    path: stock + '/quote'
  }

  const callback = (resp) => {
    var str = '';
    resp.on('data', (chunk) => {
      str += chunk;
    });

    resp.on('end', () => {
      return str;
    });
  }

  http.request(options, callback).end();
}