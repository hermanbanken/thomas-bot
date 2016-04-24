// Blue Tooth

function detect(me, users, callback) //
{
	var searchForMacs = Object.values(users).filter(function(u){
		return u._id != me.id;
	}).map(function(u){
		return u.profile.mac;
	});

	console.log("Should now search for", searchForMacs);

	setTimeout(callback, 0);
}

module.exports = detect;
