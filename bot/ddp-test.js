var ddp = require('ddp');
var ddpclient = new ddp({
  // All properties optional, defaults shown 
  host : "HMBP.local",
  port : 3000,
  ssl  : false,
  autoReconnect : true,
  autoReconnectTimer : 500,
  maintainCollections : true,
  ddpVersion : '1'
});

ddpclient.connect(function(error, wasReconnect) {
  if (error) { console.log('DDP connection error!'); return; }
  if (wasReconnect) { console.log('Reestablishment of a connection.'); }
 
  console.log('connected!');

  ddpclient.subscribe('posts', [], function () { 
    console.log('posts complete:');
    console.log(ddpclient.collections.posts);
  });

  var observer = ddpclient.observe("posts");
  observer.added = function(id) {
    console.log("[ADDED] to " + observer.name + ":  " + id);
  };
  observer.changed = function(id, oldFields, clearedFields, newFields) {
    console.log("[CHANGED] in " + observer.name + ":  " + id);
    console.log("[CHANGED] old field values: ", oldFields);
    console.log("[CHANGED] cleared fields: ", clearedFields);
    console.log("[CHANGED] new fields: ", newFields);
  };
  observer.removed = function(id, oldValue) {
    console.log("[REMOVED] in " + observer.name + ":  " + id);
    console.log("[REMOVED] previous value: ", oldValue);
  };

});