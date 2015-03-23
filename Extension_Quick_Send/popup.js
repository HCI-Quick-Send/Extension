//Store fb_id and gcm_id to database
if (localStorage.accessToken) {
	

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
			//load friends' options to #friendsList from json
			var options = "";
			for (var i = 0; i < msg.data.length; i++) {
				options += '<option value="' + msg.data[i].id + '">' + msg.data[i].name + '</option>';
			}

			console.log(options);
			$("#friendsList").html(options); //add options to select in HTML
		}
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
	var notif = 'url='+ localStorage.currentPage +'&users='+list+'&sender='+localStorage.userName;
	console.log("notif : " + notif);
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


// code below gets the current tab's URL and creates an iframe with it
//currently redirecting to an image. Have to change

var accToken = localStorage.accessToken;
var tabUrl; //url of the current tab
var msgStr; //construct the message string for the redirect URL

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	//get URL of current tab
	tabUrl = tabs[0].url;
	//store URL in local storage for getSelectValues to use
	localStorage.currentPage = tabUrl;

	$("#link").html(tabUrl);

	var istr = "http://www.facebook.com/dialog/send?" + accToken + "&app_id=1387556274895733&link=" + tabUrl + "&redirect_uri=https://www.google.com/?gws_rd=ssl&display=iframe";

	$("#myButton").click(function(event){            
		$("#myIFrame").attr('src', istr);
	});
});





