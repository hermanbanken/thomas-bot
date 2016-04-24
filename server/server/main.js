import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import { exec } from 'child_process'
import Future from 'fibers/future'

Inbox = new Mongo.Collection('inbox');

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
      console.log("Online", id.profile.name, id.status.lastLogin.ipAddr);
    },
    removed: function(id) {
      console.log("Offline", id.profile.name, id.status.lastLogin.ipAddr);
    }
  });

  Meteor.methods({
    setFace: function(faceImgSrc, forUser) {
      if(!this.userId) throw new Meteor.Error(403,"bad access");
      if(!faceImgSrc) throw new Meteor.Error(400,"bad request: give arguments = a image source and a user id");
      if(!forUser) throw new Meteor.Error(400,"bad request: give a second argument = a user id");

      var byId = Meteor.users.findOne({ _id: forUser });
      if(!byId) {
        var user = 
          Meteor.users.findOne({ "profile.name": forUser }) ||
          Meteor.users.findOne({ "emails.address": forUser });
        if(!user) {
          throw new Meteor.Error(400,"bad request: user argument did not match id's, name, or address.");
        }
        forUser = user._id;
      }

      Meteor.users.update({ _id: forUser }, { "$set": { "profile.image": faceImgSrc } });
    },

    speak: function(text, voice){
      if(!this.userId) throw new Meteor.Error(403,"bad access");

      voice = voice || "Alex";

      this.unblock();
      var future = new Future();
      var command = "say -v \""+voice+"\" \""+text+"\"";
      exec(command, function(err, stdout, stderr){
        if(err){
          console.log(err);
          throw new Meteor.Error(500,command+" failed");
        }
        console.log("Ran", command);
        future.return(stdout.toString());
      });
      return future.wait();
    },
    addMessage: function(message, forUser){
      if(!this.userId) throw new Meteor.Error(403,"bad access");
      if(!message) throw new Meteor.Error(400,"bad request: give arguments = a message and a user id");
      if(!forUser) throw new Meteor.Error(400,"bad request: give a second argument = a user id");

      var byId = Meteor.users.findOne({ _id: forUser });
      if(!byId) {
        var user = 
          Meteor.users.findOne({ "profile.name": forUser }) ||
          Meteor.users.findOne({ "emails.address": forUser });
        if(!user) {
          throw new Meteor.Error(400,"bad request: user argument did not match id's, name, or address.");
        }
        forUser = user._id;
      }

      Inbox.insert({ content: message, userId: forUser });
    },
    markTaskDone: function(messageId){
      Inbox.remove({_id: messageId, userId: this.userId});
    },
    ping: function(){
      return 'pong';
    }
  })

});

Meteor.publish("userInbox", function() {
  return Inbox.find({ userId: this.userId });
})

Meteor.publish("userStatus", function() {
  return Meteor.users.find({ }, { fields: { 'status': 1, 'username': 1, 'profile': 1 } });
});