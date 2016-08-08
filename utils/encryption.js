const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = 'oI866dhKshHO';

module.exports = {
  encrypt: function(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  },
  decrypt: function(text){
    try{
      var decipher = crypto.createDecipher(algorithm,password)
      var dec = decipher.update(text,'hex','utf8')
      dec += decipher.final('utf8');
      return dec;
    }
    catch(e){
      console.log('Failed to decrypt'.red);
      console.log(e);

      return null;
    }
  }
}