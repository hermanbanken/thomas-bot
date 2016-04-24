import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import moment from 'moment';

Inbox = new Mongo.Collection('inbox');

var defaultImage = "faces-01.jpg";

Template.main.helpers({
	devices: () => Meteor.users.find({ 
		"profile.owner": { "$exists": 1} 
	}),

	logged_in: () => Meteor.userId()
})

Template.main.events({
	"click #nav img": function() {
		Meteor.call("addMessage", "party", "thomas");
		Meteor.call("addMessage", "party", "lisa");
	},
	"click #footer": function() {
		Meteor.call("addMessage", "demo", "thomas");
		console.log("Starting demo")
	}
})

Template.login.events({
	"click button": function() {
		Meteor.loginWithPassword('gui', 'gui')
	}
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