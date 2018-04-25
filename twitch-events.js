
/*
opts =
{
    ClientID: 'foo',
    Nick: 'botshifter08',
    Pass: 'oauth:abcde12345',
    Debug: false
}
*/
function TwitchClient(opts) {

    //globals
    var 
        _clientId = opts.ClientID,
        _nick,
        client = this;

    this.Debug = opts.Debug || false;
    this.Channels = [];

    if (_clientId == undefined && this.Debug) {
        console.log('ClientID not provided, follower data will not be available.');
    }

    this.onMessage = function (data) {
        //console.log(data);
    }

    function OnWebsocketOpen() {
        this.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        if (opts.Nick && opts.Pass) {
            this.send('PASS ' + (opts.Pass.indexOf('oauth:') == 0 ? '' : 'oauth:') + opts.Pass);
            this.send('NICK ' + opts.Nick);
        }
        else {
            this.send('NICK justinfan' + Math.floor(Math.random() * 999999));
        }
        this.send('JOIN timeshifter08');
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
                _ws.send('PONG ' + parts[1].substring(1));
            }
            //else if (parts[1] == 'JOIN') {
            //    fireEvent('onJoin', line);
            //}
            //else if (parts[1] == 'PART') {
            //    fireEvent('onPart', line);
            //}
            //else if (parts[1] == 'MODE') {
            //    fireEvent('onMode', line);
            //}
            //else if (parts[2] == 'PRIVMSG') {
            //    fireEvent('onPrivmsg', line);
            //}
            //else if (parts[2] == 'ROOMSTATE') {
            //    InitChannel(line);
            //    fireEvent('onRoomstate', line);
            //}
            //else if (parts[2] == 'USERNOTICE') {
            //    fireEvent('onUsernotice', line);
            //}
            //else {
            //    console.log('>' + line);
            //}
        }

    }

    function OnWebsocketError(e) {
        if (debug) {
            console.log('Websocket error: ', e);
        }
    }

    function OnWebsocketClose(e) {
        setTimeout(function () {
            InitWebsocket();
        }, 1000);
    }

    this.Connect = function () {
       this._ws = new WebSocket('wss://irc-ws.chat.twitch.tv');
       this._ws.onopen = function () {
           this.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
           if (opts.Nick && opts.Pass) {
               this.send('PASS ' + (opts.Pass.indexOf('oauth:') == 0 ? '' : 'oauth:') + opts.Pass);
               this.send('NICK ' + opts.Nick);
           }
           else {
               this.send('NICK justinfan' + Math.floor(Math.random() * 999999));
           }
           this.send('JOIN timeshifter08');
       };

       this._ws.onmessage = function (msgData) {
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
                   _ws.send('PONG ' + parts[1].substring(1));
               }
               //else if (parts[1] == 'JOIN') {
               //    fireEvent('onJoin', line);
               //}
               //else if (parts[1] == 'PART') {
               //    fireEvent('onPart', line);
               //}
               //else if (parts[1] == 'MODE') {
               //    fireEvent('onMode', line);
               //}
               //else if (parts[2] == 'PRIVMSG') {
               //    fireEvent('onPrivmsg', line);
               //}
               //else if (parts[2] == 'ROOMSTATE') {
               //    InitChannel(line);
               //    fireEvent('onRoomstate', line);
               //}
               //else if (parts[2] == 'USERNOTICE') {
               //    fireEvent('onUsernotice', line);
               //}
               //else {
               //    console.log('>' + line);
               //}
           }
       };
       this._ws.onerror = OnWebsocketError;
       this._ws.onclose = OnWebsocketClose;
    }





    //InitWebsocket();
    this.Connect();
}
