import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

Devices = new Mongo.Collection('devices');

Meteor.startup(() => {
  // code to run on server at startup
  ["thomas@edison", "lisa@edison", "gui@local"]
    .filter(name => !Meteor.users.findOne({ username: name.split("@")[0] }))
    .forEach(name => {
      Accounts.createUser({
        username: name.split("@")[0],
        email: name,
        password: name.split("@")[0],
        profile: { name: name.split("@")[0] }
      })
    });

  [['thomas', 'Herman'], ['lisa', 'Martijn']]
    .forEach(function(u){
      Meteor.users.update({ username: u[0] }, { 
        $set: { "profile.owner": u[1] }
      });
    });

  Meteor.users.find({ "status.online": true }).observe({
    added: function(id) {
      console.log("Online", id);
      // id just came online
    },
    removed: function(id) {
      console.log("Offline", id);
      // id just went offline
    }
  });
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find({ }, { fields: { 'status': 1 } });
});