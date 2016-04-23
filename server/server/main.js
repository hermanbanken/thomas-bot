import { Meteor } from 'meteor/meteor';

Devices = new Mongo.Collection('devices');

Meteor.startup(() => {
  // code to run on server at startup
  if(Devices.find().count() == 0) {
  	Devices.insert({
  		name: "Lisa",
  		owner: "Martijn",
  		online: true,
  		lastPing: new Date() 
  	})
  	Devices.insert({
  		name: "Thomas",
  		owner: "Herman",
  		online: false,
  		lastPing: new Date()
  	})
  }

});
