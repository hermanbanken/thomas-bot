var ddp = require('ddp');
var login = require('ddp-login');
var fs = require('fs');
var q = require('q');
var readline = require('readline');

module.exports = function(ddpOptions) {
  var ddpclient = new ddp(ddpOptions);
  return q.ninvoke(ddpclient, 'connect')
    .then(function(wasReconnect){
      if (wasReconnect) { 
        console.info('Reestablishment of a connection.'); 
      }

      return q.nfcall(userInfo.get)
        // Try token
        .then(function(user){ return q.nfcall(login.loginWithToken, ddpclient, user.token) })
        // Else normal login
        .fail(function(e){ 
          console.warn("Token login failed. Trying password login.");
          return q(prompt('Give the password for this client: ')).then(function(pass){
            console.info("Logging in with thomas@edison");
            return q.nfcall(login.loginWithEmail, ddpclient, 'thomas@edison', pass); 
          })
        })
        // Save token
        .then(userInfo.save)
        .fail(function(e){console.error(e)})
    })
    .then(function() { return ddpclient });
}


function prompt(question) {
  var rl = readline.createInterface({ 
    input: process.stdin,
    output: process.stdout
  });
  var deferred = q.defer();
  rl.question(question, function(answer) {
    rl.close();
    deferred.resolve(answer);
  });
  return deferred.promise;
}

var userInfo = {
  save: function(result){
    console.log("logged in until", result.tokenExpires);
    result.tokenExpires = new Date(result.tokenExpires).getTime()
    fs.writeFileSync('user.conf', JSON.stringify(result));
  },
  get: function(cb){
    fs.stat('user.conf', function(err){
      if(err) { return cb({}, null); }

      var data = fs.readFileSync('user.conf');
      var user = data && JSON.parse(data);
      var now = (new Date).getTime();
      if(user && user.token && user.tokenExpires > now){
        cb(null, user);
      } else cb(new Error("no user token found"));
    })
  }
}