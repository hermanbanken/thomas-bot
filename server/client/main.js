import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import moment from 'moment';

Inbox = new Mongo.Collection('inbox');

Template.main.helpers({
	devices: () => Meteor.users.find({ 
		"profile.owner": { "$exists": 1} 
	})
})

Template.main.event({
	"#footer click": function() {
		Meteor.call("addMessage", "demo", "thomas");
		console.log("Starting demo")
	}
})

Template.device.helpers({
	lastOnline: function(){
		return moment(this.status.lastLogin.date).fromNow()
	}
})

Meteor.subscribe("userStatus");