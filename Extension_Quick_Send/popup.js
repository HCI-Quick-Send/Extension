if (localStorage.accessToken) {
	var graphUrl = "https://graph.facebook.com/me/taggable_friends?" + localStorage.accessToken;
	console.log(graphUrl);
	var  json = httpGet(graphUrl);
	var obj = JSON.parse(json);
	console.log(json);
}
		
function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}