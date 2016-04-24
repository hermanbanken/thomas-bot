import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import { moment } from 'moment';

Devices = new Mongo.Collection('devices');

Template.main.helpers({
	devices: () => Meteor.users.find({ 
		"profile.owner": { "$exists": 1} 
	}),
	lastOnline: function(){
		return moment(this.status.lastLogin.date).fromNow()
	}
})

Meteor.subscribe("userStatus");