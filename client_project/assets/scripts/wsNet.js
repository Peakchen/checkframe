/**
 * websocket 
 */

let Global = require("common")
//let Player = require("Player")

cc.Class({
    //extends: cc.Component,

    /*
    readyState:
        CONNECTING 0
        OPEN       1
        CLOSING    2
        CLOSED     3
    */
   
    CanSendMsg: function(){
        if (Global.ws == null){
            return false
        }

        return (Global.ws.readyState == WebSocket.CONNECTING || Global.ws.readyState == WebSocket.OPEN)
    },  

    newPlayer: function(arrData){
        Global.newplayerCreated = 1
        Global.newplayerPosx = arrData[4]
        if (arrData[3] == 2) {
            Global.newplayerPosx = 0 - Global.newplayerPosx
        }
        Global.newplayerPosy = arrData[6]
        if (arrData[5] == 2) {
            Global.newplayerPosy = 0 - Global.newplayerPosy
        }
    },

    swConnect: function(){
        if (Global.ws != null) {
            return
            cc.log("readyState: ", Global.ws.readyState)
            if (Global.ws.readyState == WebSocket.CONNECTING || Global.ws.readyState == WebSocket.OPEN) { //已经连上就不必再连
                return
            }
        }

        cc.log("addr: ", Global.wsAddr, Global.ws == null)
        var ws = new WebSocket(Global.wsAddr);
        ws.onopen = function(e) {
            cc.log("ws open: ", ws.readyState)
        }

        ws.onmessage = function(e) {
            /**
             * 消息解析 
             * 0: 消息id
             * 1：消息长度
             * 2：sessionid
             * 3：nodex x坐标正负标记
             * 4：nodex x坐标值
             * 5：nodey y坐标正负标记
             * 6：nodey y坐标值 
             */
            var data = new Uint32Array(e.data)
            var msgid = data[0] 
            switch (msgid) {
                case Global.MID_login:
                    cc.log("ws message MID_login: ", data[1], data[2], data[3], data[4], data[5], data[6])
                    var key = data[2].toString()
                    var nodex = data[4]
                    var nodey = data[6]
                    if (data[3] == 2){
                        nodex = 0 - nodex
                    }
                    if (data[5] == 2){
                        nodey = 0 - nodey
                    }
                    var playerProp = {
                        sessionId: data[2],
                        nodex: nodex,
                        nodey: nodey
                    }
                    if (Global.PlayerSessionMap.has(key) == false) {
                        Global.PlayerSessionMap.set(key, playerProp)
                    }
                    Global.NewplayerMap.set(key, playerProp)
                    Global.newPlayerIds.push(key)
                    break;
                case Global.MID_logout:
                    var key = data[2].toString()
                    cc.log("ws message MID_logout, sessionid: ", key)
                    Global.DelPlayerIds.push(key)
                    Global.PlayerSessionMap.delete(key)
                    break;
                case Global.MID_move:
                    cc.log("ws message MID_move: ", data[1], data[2], data[3], data[4], data[5], data[6])
                    var key = data[2].toString()
                    var nodex = data[4]
                    var nodey = data[6]
                    if (data[3] == 2){
                        nodex = 0 - nodex
                    }
                    if (data[5] == 2){
                        nodey = 0 - nodey
                    }
                    var playerProp = {
                        sessionId: data[2],
                        nodex: nodex,
                        nodey: nodey
                    }
                    if (Global.PlayerSessionMap.has(key) == false) {
                        Global.PlayerSessionMap.set(key, playerProp)
                    }
                    Global.NewplayerMap.set(key, playerProp)
                    Global.newPlayerIds.push(key)
                    cc.log("MID_move purple monsters: ", Global.newPlayerIds.length)
                    break;
                default:
                    cc.log("未知 消息id: ", msgid)
            }
        }

        ws.onerror = function (e) {
            cc.log("ws error: ", ws.readyState)
            Global.ws = null
        }

        ws.onclose = function (e) {
            cc.log("ws close: ", ws.readyState)
            //Player.sendPlayerPos()
            Global.ws = null
        }

        cc.log("global ws init, state: ", ws.readyState)
        Global.ws = ws
    },

    /**
     * 
     * @param {*} data  具体数据, 1：长度，2：是否广播，3：... 具体消息数据
     */
    sendwsmessage: function(data){
        
        if (Global.ws == null) {
            return
        }

        if (Global.ws != null) {
            if (Global.ws.readyState == WebSocket.CLOSED || Global.ws.readyState == WebSocket.CLOSING) { //正在断开或者已经断开，则不能发送消息
                return
            }
        }

        cc.log("ws sendwsmessage: ", Global.ws.readyState)
        Global.ws.send(data)
    }
})