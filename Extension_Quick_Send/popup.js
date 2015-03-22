//Store fb_id and gcm_id to database
if (localStorage.accessToken) {
	var userUrl = "https://graph.facebook.com/me?" + localStorage.accessToken;
	
			var user_request = $.ajax({
			  url: userUrl,
			  type: "GET",
			  error: function() {
				  console.log("Request failed!");
				},
			  success:function(msg) {
					console.log(msg);
					registerDB(msg.id);
				}
			});

	var friendsUrl = "https://graph.facebook.com/me/friends?" + localStorage.accessToken;
	console.log(graphUrl);
	var friends_request = $.ajax({
	  url: friendsUrl,
	  type: "GET",
	  error: function() {
		  console.log("Request failed!");
		},
	  success:function(msg) {
			console.log(msg);
		}
	});
}
function registerDB(fbid)
{
	chrome.storage.local.get('regid', function(result){
		var keys = 'fb_id='+fbid+'&gcm_id='+result.regid;
		console.log(keys);
		var request = $.ajax({
			url: "http://ec2-54-152-80-39.compute-1.amazonaws.com:8080/api/users",
			type: "POST",
			data: keys,
			error:function() {
			  console.log("Request failed!");
			},
			success:function(msg) {
				console.log(msg);
			}
		});
	});
}

