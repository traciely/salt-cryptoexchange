let request = require('superagent');

exports.getCurrentPrices = function getCurrentPrices(fsyms, tsyms) {
  return request.get('https://min-api.cryptocompare.com/data/pricemulti')
  .query({ fsyms: fsyms })
  .query({ tsyms: tsyms })
  .then(res => {
    return res.text;
  })
  .catch(err => {
    throw err;
  });
}