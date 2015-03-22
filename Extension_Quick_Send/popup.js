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
	console.log(friendsUrl);
	var friends_request = $.ajax({
	  url: friendsUrl,
	  type: "GET",
	  error: function() {
		  console.log("Request failed!");
		},
	  success:function(msg) {
			console.log(msg);
			console.log("msg.data");
				console.log(msg.data);
				var options = "";
				for (var i = 0; i < msg.data.length; i++) {
					console.log(msg.data[i]);
					options += '<option value="' + msg.data[i].id + '">' + msg.data[i].name + '</option>';
				}
				console.log(options);
				$("#friendsList").html(options);
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

//gets user IDs of the selected friends and sends GCM notifications to them
function getSelectValues(select) {
 	var result = [];
 	var options = select && select.options;
 	var opt;

  	for (var i=0, iLen=options.length; i<iLen; i++) {
		opt = options[i];
		if (opt.selected) {
		  result.push(opt.value);
		}
  	}

  	var list = '';
	if(result.length > 0){
		for(var i=0; i<result.length-1; i++){
				list += result[i]+',';
		}
		
		list += result[result.length-1];
	}

	//send GCM notifications
	var notif = 'url='+ localStorage.currentPage +'&users='+list;
	var notification = $.ajax({
					url: "http://54.152.80.39:8080/api/gcm/send",
					type: "POST",
					data: notif,
					error:function() {
					  console.log("Request failed!");
					},
					success:function(msg) {
							console.log(msg);
					}
	});
}

$(document).ready(function(){
	$("#btn").click(function(){
		var el = document.getElementsByTagName('select')[0];
		console.log(getSelectValues(el));
	});
});


// code below gets the current tab's URL and inserts it into the HTML
//currently redirecting to an image. Have to change
var accToken = localStorage.accessToken;

//var str1 = "<a href=\"http://www.facebook.com/dialog/send?" + accToken + "&app_id=1387556274895733&link="	//first half of the final message string
//var str2 = "&redirect_uri=http://www.freeemailtutorials.com/freeFacebookTutorials/i/Email%20sent%20confirmation%20message%20in%20your%20Facebook%20account.jpg&display=popup\" target=\"_blank\"> Message </a>"	//second half of the final message string

var tabUrl; //url of the current tab
var msgStr; //construct the message string for the redirect URL



chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	//get URL of current tab
	tabUrl = tabs[0].url;
	
	localStorage.currentPage = tabUrl;
	//construct final string
	//msgStr = str1 + tabUrl + str2;

	var istr = "http://www.facebook.com/dialog/send?" + accToken + "&app_id=1387556274895733&link=" + tabUrl + "&redirect_uri=https://www.google.com/?gws_rd=ssl&display=iframe";

	$("#myButton").click(function(event){            
	$("#myIFrame").attr('src', istr);
	});
});





