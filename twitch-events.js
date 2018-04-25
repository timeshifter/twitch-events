
/*
opts =
{
    ClientID: 'foo',
    Nick: 'botshifter08',
    Pass: 'oauth:abcde12345',
    Debug: false,
    onConnect: f()
}
*/
function TwitchClient(opts) {

    //privates
    var _ws,
        _clientId = opts.ClientID,
        _nick,
        client = this,
        _defaultEventsHandled = {};


    //publics
    this.Debug = opts.Debug || false;
    this.Channels = [];


    if (_clientId == undefined && this.Debug) {
        console.log('ClientID not provided; follower data will not be available.');
    }


    //websocket handlers
    function OnWebsocketOpen() {
        this.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        if (opts.Nick && opts.Pass) {
            this.send(`PASS ${(opts.Pass.indexOf('oauth:') == 0 ? '' : 'oauth:')} ${opts.Pass}`);
            this.send(`NICK ${opts.Nick}`);
        }
        else {
            this.send(`NICK justinfan ${Math.floor(Math.random() * 999999)}`);
        }
    }

    function OnWebsocketMessage(msgData) {
        var data = msgData.data.split('\r\n');

        for (line of data) {

            if (line.trim() == '') {
                continue;
            }

            if (client.Debug) {
                console.log('>' + line);
            }

            client.onMessage(line);

            var parts = line.split(' ');

            if (parts[0] == 'PING') {
                _ws.send(`PONG ${parts[1].substring(1)}`);
            }
            else if (parts[1] == 'JOIN') {
                //fireEvent('onJoin', line);
            }
            else if (parts[1] == 'PART') {
                //fireEvent('onPart', line);
            }
            else if (parts[1] == 'MODE') {
                //fireEvent('onMode', line);
            }
            else if (parts[2] == 'PRIVMSG') {
                var colonSplit = line.split(':');
                var user = colonSplit[1].split('!')[0],
                    channel = colonSplit[1].split('#')[1].trim();

                client.onPrivmsg(user, channel, colonSplit.shift().shift().join(':'));

                //fireEvent('onPrivmsg', line);
            }
            else if (parts[2] == 'ROOMSTATE') {
                //this.InitChannel(line);
                //fireEvent('onRoomstate', line);
            }
            else if (parts[2] == 'USERNOTICE') {
                //fireEvent('onUsernotice', line);
            }
            else {
                //console.log('>' + line);
            }
        }
    }

    function OnWebsocketError(e) {
        if (client.Debug) {
            console.log(`Websocket error: ${e}`);
        }
        setTimeout(function () {
            InitWebsocket();
        }, 1000);
    }

    function OnWebsocketClose(e) {
        setTimeout(function () {
            InitWebsocket();
        }, 1000);
    }


    //public functions

    this.Connect = function () {
        _ws = new WebSocket('wss://irc-ws.chat.twitch.tv');
        _ws.onopen = OnWebsocketOpen;
        _ws.onmessage = OnWebsocketMessage;
        _ws.onerror = OnWebsocketError;
        _ws.onclose = OnWebsocketClose;
    }

    ///Send a message to the specified channel
    this.SendMessage = function (channel, message) {
        if (channel.indexOf('#') != 0)
            channel = '#' + channel;

        _ws.send(`PRIVMSG ${channel} :${message}`);
    }

    ///Join a single channel or an array of channel names
    this.JoinChannels = function (channels) {
        var arr = [];
        if (!Array.isArray(channels)) {
            arr.push(channels);
        }
        else {
            arr = channels;
        }

        for (c of arr) {
            c = c.trim().toLowerCase();
            this.Channels.push(c);
            if (c[0] != '#')
                c = '#' + c;
            _ws.send(`JOIN ${c}`);
        }
    }


    //events

    this.onMessage = function (message) {
        if (!_defaultEventsHandled.onMessage) {
            console.log('onMessage event not handled!');
            _defaultEventsHandled.onMessage = true;
        }
    }

    this.onPrivmsg = function (user, channel, message) {
        if (!_defaultEventsHandled.onPrivmsg) {
            console.log('onPrivmsg event not handled!');
            _defaultEventsHandled.onPrivmsg = true;
        }
    }



    this.Connect();

    
}
