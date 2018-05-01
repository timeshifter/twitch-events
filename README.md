# Twitch Events

This is a JavaScript library that intends to consolidate and simplify all events that are relevant to a Twitch chat, i.e. followers, subscribes, etc.

It exposes every event available, but JOIN and PART events appear to be sent out in recurring batches, and I've seen delays up to several minutes before a JOIN event is sent. This library will not attempt to short-circuit those events; they are exposed as they are dispatched.

----

## Current implementation notes:

Chat rooms are currently only supported by full room ID, i.e. `chatrooms:61927669:a0c1e70d-7d52-491a-bcd5-6db6a5492d64`. This will be streamlined in a future version.

----

### Initialization

```html
<script src="https://raw.githubusercontent.com/timeshifter/twitch-events/master/twitch-events.js"></script>
```

```javascript
var client = new TwitchClient({
	ClientID: 'abcde12345',
	Nick: 'botshifter08',
	Pass: 'oauth:54321edcba',
	Debug: true
});

client.JoinChannels('timeshifter08');
```

### Parameters

| Parameter | Notes |
| --- | --- |
|  ClientID | Your app's Client ID as provided by Twitch |
| Nick/Pass | The nickname/password you want the library to connect as. Required for joining rooms. |
| Debug | Enables a complete WebSocket log to the console. Defaults to `false`. |

### Methods

| Method | Notes |
| --- | --- |
| `Connect()` | Initializes the WebSocket connection with the credentials specified on instantiation. Should never need to be called manually; the library will automatically attempt to reconnect if any disruptions occur. |
| `JoinChannels(obj)` | Join the specified channel(s). Accepts a `String` or `Array` of channel names/room ID's. |
| `LeaveChannels(obj)` | Leave the specified channel(s). Accepts a `String` or `Array` of channel names/room ID's. |
| `SendMessage(channel, message)` | Sends a message to the specified channel/room ID. Cannot send to channels you haven't joined. |

### Default event signatures

```javascript
//intended for troubleshooting purposes; this event fires for *every* message received from the WebSocket
client.onMessage = function (message) {
	console.log('onMessage', { 'Message': message, 'Timestamp': new Date() });
};

client.onPrivmsg = function (user, channel, message) {
	console.log('onPrivmsg', { 'Username': user, 'Channel': channel, 'Message': message, 'Timestamp': new Date() });
};

client.onJoin = function (user, channel) {
	console.log('onJoin', { 'Username': user, 'Channel': channel, 'Timestamp': new Date() });
};

client.onPart = function (user, channel) {
	console.log('onPart', { 'Username': user, 'Channel': channel, 'Timestamp': new Date() });
};

client.onRoomstate = function (channel, settings) {
	console.log('onRoomstate', { 'Channel': channel, 'Settings': settings, 'Timestamp': new Date() });
};

client.onUsernotice = function (message) {
	console.log(message);
};
```