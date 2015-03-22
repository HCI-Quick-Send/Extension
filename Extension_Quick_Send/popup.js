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

	var graphUrl = "https://graph.facebook.com/me/taggable_friends?" + localStorage.accessToken;
	console.log(graphUrl);
	var  json = httpGet(graphUrl);
	var obj = JSON.parse(json);
	//console.log(json);
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
function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

