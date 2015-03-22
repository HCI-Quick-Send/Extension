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

// code below gets the current tab's URL and inserts it into the HTML
//currently redirecting to an image. Have to change

var str1 = "<a href=\"http://www.facebook.com/dialog/send?app_id=1387556274895733&link="	//first half of the final message string
var str2 = "&redirect_uri=http://www.freeemailtutorials.com/freeFacebookTutorials/i/Email%20sent%20confirmation%20message%20in%20your%20Facebook%20account.jpg&display=popup\" target=\"_blank\"> Message </a>"	//second half of the final message string

var tabUrl; //url of the current tab
var msgStr; //construct the message string for the redirect URL

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    //get URL of current tab
    tabUrl = tabs[0].url;
    
    //construct final string
    msgStr = str1 + tabUrl + str2;

    //add URL to HTML 
    $("#msg_url").html(msgStr);
});



