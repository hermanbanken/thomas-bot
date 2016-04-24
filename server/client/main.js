import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import moment from 'moment';

Devices = new Mongo.Collection('devices');

var defaultImage = "faces-01.jpg";

Template.main.helpers({
	devices: () => Meteor.users.find({ 
		"profile.owner": { "$exists": 1} 
	})
})

Template.device.helpers({
	lastOnline: function(){
		return moment(this.status.lastLogin.date).fromNow()
	},

	face: function(){
		var img = this.profile.image || defaultImage;
		console.log("face", img)
		return img;
	},

	message: function(){
		return this.profile.message;
	},

	hideMessage: function(){
		return !this.profile.message;
	}
})

Meteor.subscribe("userStatus");