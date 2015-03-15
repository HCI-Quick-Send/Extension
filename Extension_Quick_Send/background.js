function registerCallback(registrationId) {
	

  if (chrome.runtime.lastError) {
    // When the registration fails, handle the error and retry the
    // registration later.

  }

  // Send the registration ID to your application server.
  sendRegistrationId(function(succeed) {
    // Once the registration ID is received by your server,
    // set the flag such that register will not be invoked
    // next time when the app starts up.
    if (succeed)
	{
	console.log('Reg ID: ' +  registrationId);
	console.log(Object.prototype.toString.call(registrationId) );
      chrome.storage.local.set({registered: true});
	  chrome.storage.local.set({regid: registrationId});
	}
  });
}
function checkRegistered() {
  chrome.storage.local.get("registered", function(result) {
    // If already registered, bail out.
    if (result["registered"])
      return;
    // Up to 100 senders are allowed.
    var senderIds = ["1083702790790"];
    chrome.gcm.register(senderIds, registerCallback);
  });
}
  
function sendRegistrationId(callback) {
  // Send the registration ID to your application server
  // in a secure way.
  callback(true);
}

function unregisterCallback() {
  if (chrome.runtime.lastError) {
    // When the unregistration fails, handle the error and retry
    // the unregistration later.
    return;
  }
}

chrome.gcm.unregister(unregisterCallback);

chrome.gcm.onMessage.addListener(function(message) {
  // A message is an object with a data property that
  // consists of key-value pairs.
  console.log('Message!!!!!!!!!!!');
  var messageString = "";
  for (var key in message.data) {
    if (messageString != "")
      messageString += ", "
    messageString += key + ":" + message.data[key];
  }
  console.log("Message received: " + messageString);
});

chrome.runtime.onStartup.addListener(checkRegistered);
chrome.runtime.onInstalled.addListener(checkRegistered);
// Substitute your own sender ID here. This is the project
// number you got from the Google Developers Console.
var senderId = "1083702790790";

// Make the message ID unique across the lifetime of your app.
// One way to achieve this is to use the auto-increment counter
// that is persisted to local storage.

// Message ID is saved to and restored from local storage.
var messageId = 0;
chrome.storage.local.get("messageId", function(result) {
  if (chrome.runtime.lastError)
    return;
  messageId = parseInt(result["messageId"]);
  if (isNaN(messageId))
    messageId = 0;
});

// Sets up an event listener for send error.
chrome.gcm.onSendError.addListener(sendError);

// Returns a new ID to identify the message.
function getMessageId() {
  messageId++;
  chrome.storage.local.set({messageId: messageId});
  return messageId.toString();
}

function sendMessage() {
  var message = {
    messageId: getMessageId(),
    destinationId: senderId + "@gcm.googleapis.com",
    timeToLive: 86400,    // 1 day
    data: {
      "key1": "value1",
      "key2": "value2"
    }
  };
  
}

function sendError(error) {
  console.log("Message " + error.messageId +
      " failed to be sent: " + error.errorMessage);
}

chrome.gcm.onMessagesDeleted.addListener(messagesDeleted);

function messagesDeleted() {
  // All messages have been discarded from GCM. Sync with
  // your application server to recover from the situation.
}

console.log(chrome.storage.local.get('registered', function(result){
        console.log(result.registered);
    }));
console.log(chrome.storage.local.get('regid', function(result){
		console.log("RegID: " + result.regid);
    }));