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
  console.log(result);
  var list = '';
	if(result.length > 0)
	{
	        for(var i=0; i<result.length-1; i++)
	        {
	                list += result[i]+',';
	        }
	        list += result[result.length-1];
	}

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
  
  return result;
}

$(document).ready(function(){
	$("#btn").click(function(){
		console.log("inside click");
		var el = document.getElementsByTagName('select')[0];
		console.log(getSelectValues(el));
	});
});




// clean up the code below


// code below gets the current tab's URL and inserts it into the HTML
//currently redirecting to an image. Have to change
var accToken = localStorage.accessToken;
var str1 = "<a href=\"http://www.facebook.com/dialog/send?" + accToken + "&app_id=1387556274895733&link="	//first half of the final message string
var str2 = "&redirect_uri=http://www.freeemailtutorials.com/freeFacebookTutorials/i/Email%20sent%20confirmation%20message%20in%20your%20Facebook%20account.jpg&display=popup\" target=\"_blank\"> Message </a>"	//second half of the final message string

var tabUrl; //url of the current tab
var msgStr; //construct the message string for the redirect URL



chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    //get URL of current tab
    tabUrl = tabs[0].url;
    
    localStorage.currentPage = tabUrl;
    //construct final string
    msgStr = str1 + tabUrl + str2;

    //add URL to HTML 
    $("#msg_url").html(msgStr);

    var istr = "http://www.facebook.com/dialog/send?" + accToken + "&app_id=1387556274895733&link=" + tabUrl + "&redirect_uri=https://www.google.com/?gws_rd=ssl&display=iframe";

    $("#myButton").click(function(event){            
    $("#myIFrame").attr('src', istr);
	});
});





