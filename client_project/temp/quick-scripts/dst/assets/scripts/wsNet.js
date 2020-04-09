
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/wsNet.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f5f02ULtVhD47PNH08lZ5uR', 'wsNet');
// scripts/wsNet.js

"use strict";

/**
 * websocket 
 */
var Global = require("common"); //心跳检测


var HeartCheck = {
  timeout: 60000,
  //60秒
  timeoutObj: null,
  serverTimeoutObj: null,
  disconnectioned: false,
  reconnectTimeoutobj: null,
  reset: function reset() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  startHeartBeat: function startHeartBeat() {
    var self = this;
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，onmessage拿到返回的心跳就说明连接正常
      cc.log("send heart beat...");

      if (Global.ws == null) {
        return;
      }

      var buff = new ArrayBuffer(12);
      var data = new Uint32Array(buff);
      data[0] = Global.MID_HeartBeat; //消息ID

      data[1] = 1; //消息长度

      data[2] = 0; //anything 随意填充一个数

      Global.ws.send(data);
      self.serverTimeoutObj = setTimeout(function () {
        //心跳超时主动断开
        cc.log("close connection...");

        if (Global.ws == null) {
          return;
        }

        Global.ws.close();
        self.disconnectioned = true;
      }, self.timeout);
    }, this.timeout);
  },
  hasDisconnected: function hasDisconnected() {
    return this.disconnectioned;
  },
  stopReconnectTimer: function stopReconnectTimer() {
    //cc.log("close reconnectTimeout...")
    clearTimeout(this.reconnectTimeoutobj);
  }
};
cc.Class({
  //extends: cc.Component,

  /*
  readyState:
      CONNECTING 0
      OPEN       1
      CLOSING    2
      CLOSED     3
  */
  CanSendMsg: function CanSendMsg() {
    if (Global.ws == null) {
      return false;
    }

    return Global.ws.readyState == WebSocket.CONNECTING || Global.ws.readyState == WebSocket.OPEN;
  },
  swConnect: function swConnect() {
    if (Global.ws != null) {
      //return
      //cc.log("readyState: ", Global.ws.readyState)
      if (Global.ws.readyState == WebSocket.CONNECTING || Global.ws.readyState == WebSocket.OPEN) {
        //已经连上就不必再连
        return;
      }
    }

    var self = this;
    cc.log("addr: ", Global.wsAddr, Global.ws == null);
    var ws = new WebSocket(Global.wsAddr);

    ws.onopen = function (e) {
      cc.log("ws open: ", ws.readyState); //发送心跳

      HeartCheck.reset().startHeartBeat();
    };

    ws.onmessage = function (e) {
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
      var data = new Uint32Array(e.data);
      var msgid = data[0];

      switch (msgid) {
        case Global.MID_login:
          cc.log("ws message MID_login: ", data[1], data[2], data[3], data[4], data[5], data[6]);
          var key = data[2].toString();
          var nodex = data[4];
          var nodey = data[6];

          if (data[3] == 2) {
            nodex = 0 - nodex;
          }

          if (data[5] == 2) {
            nodey = 0 - nodey;
          }

          var playerProp = {
            sessionId: data[2],
            nodex: nodex,
            nodey: nodey
          };

          if (Global.PlayerSessionMap.has(key) == false) {
            Global.PlayerSessionMap.set(key, playerProp);
          }

          Global.NewplayerMap.set(key, playerProp);
          Global.newPlayerIds.push(key);
          cc.log("ws message MID_login: ", Global.newPlayerIds.length, key, Global.NewplayerMap.has(key));
          break;

        case Global.MID_logout:
          var key = data[2].toString();
          cc.log("ws message MID_logout, sessionid: ", key);
          Global.DelPlayerIds.push(key);
          Global.PlayerSessionMap["delete"](key);
          break;

        case Global.MID_move:
          //cc.log("ws message MID_move: ", data[1], data[2], data[3], data[4], data[5], data[6])
          var key = data[2].toString();
          var nodex = data[4];
          var nodey = data[6];

          if (data[3] == 2) {
            nodex = 0 - nodex;
          }

          if (data[5] == 2) {
            nodey = 0 - nodey;
          }

          var playerProp = {
            sessionId: data[2],
            nodex: nodex,
            nodey: nodey
          };

          if (Global.PlayerSessionMap.has(key) == false) {
            Global.PlayerSessionMap.set(key, playerProp);
          }

          Global.NewplayerMap.set(key, playerProp);
          Global.newPlayerIds.push(key);
          cc.log("MID_move purple monsters: ", Global.newPlayerIds.length, key, Global.NewplayerMap.has(key));
          break;

        case Global.MID_Bump:
          //cc.log("ws message MID_Bump: ", data[1], data[2], data[3], data[4], data[5], data[6])

          /**
           *  0: 消息ID
              1：消息长度
              2: 成功失败标志 (失败则只需要前三个字段)
              3: 星星x坐标正负标志
              4: 星星x坐标
              5：星星y坐标正负标志
              6：星星y坐标
           */
          if (data[2] == 0) {
            //失败
            cc.log("ws message MID_Bump fail ... ");
            break;
          }

          var nodex = data[4];
          var nodey = data[6];

          if (data[3] == 2) {
            nodex = 0 - nodex;
          }

          if (data[5] == 2) {
            nodey = 0 - nodey;
          }

          var starProp = {
            nodex: nodex,
            nodey: nodey
          };
          Global.newStarPos.set(Global.newStarKey, starProp);
          break;

        case Global.MID_HeartBeat:
          cc.log("ws message MID_HeartBeat: ", msgid);
          break;

        case Global.MID_StarBorn:
          cc.log("ws message MID_StarBorn: ", data[2], data[3], data[4], data[5]);
          /**
           *  0: 消息ID
              1：消息长度
              2: 星星x坐标正负标志
              3: 星星x坐标
              4：星星y坐标正负标志
              5：星星y坐标
           */

          var nodex = data[3];
          var nodey = data[5];

          if (data[2] == 2) {
            nodex = 0 - nodex;
          }

          if (data[4] == 2) {
            nodey = 0 - nodey;
          }

          var starProp = {
            nodex: nodex,
            nodey: nodey
          };
          Global.newStarPos.set(Global.newStarKey, starProp);
          break;

        case Global.MID_GM:
          cc.log("ws message MID_GM...");
          break;

        default:
          cc.log("未知 消息id: ", msgid);
      } //发送心跳


      HeartCheck.reset().startHeartBeat();
    };

    ws.onerror = function (e) {
      cc.log("ws error: ", ws.readyState); //Global.ws = null

      if (HeartCheck.hasDisconnected() == false) {
        HeartCheck.stopReconnectTimer();
        HeartCheck.reconnectTimeoutobj = setTimeout(function () {
          self.swConnect();
        }, 1000);
      } else {
        HeartCheck.stopReconnectTimer();
      }
    };

    ws.onclose = function (e) {
      cc.log("ws close: ", ws.readyState); //Global.ws = null

      if (HeartCheck.hasDisconnected() == false) {
        HeartCheck.stopReconnectTimer();
        HeartCheck.reconnectTimeoutobj = setTimeout(function () {
          self.swConnect();
        }, 1000);
      } else {
        HeartCheck.stopReconnectTimer();
      }
    };

    cc.log("global ws init, state: ", ws.readyState);
    Global.ws = ws;
  },

  /**
   * 
   * @param {*} data  具体数据, 1：长度，2：是否广播，3：... 具体消息数据
   */
  sendwsmessage: function sendwsmessage(data) {
    if (Global.ws == null) {
      return;
    }

    if (Global.ws != null) {
      if (Global.ws.readyState == WebSocket.CLOSED || Global.ws.readyState == WebSocket.CLOSING) {
        //正在断开或者已经断开，则不能发送消息
        return;
      }
    } //cc.log("ws sendwsmessage: ", Global.ws.readyState)


    Global.ws.send(data);
  }
});

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcd3NOZXQuanMiXSwibmFtZXMiOlsiR2xvYmFsIiwicmVxdWlyZSIsIkhlYXJ0Q2hlY2siLCJ0aW1lb3V0IiwidGltZW91dE9iaiIsInNlcnZlclRpbWVvdXRPYmoiLCJkaXNjb25uZWN0aW9uZWQiLCJyZWNvbm5lY3RUaW1lb3V0b2JqIiwicmVzZXQiLCJjbGVhclRpbWVvdXQiLCJzdGFydEhlYXJ0QmVhdCIsInNlbGYiLCJzZXRUaW1lb3V0IiwiY2MiLCJsb2ciLCJ3cyIsImJ1ZmYiLCJBcnJheUJ1ZmZlciIsImRhdGEiLCJVaW50MzJBcnJheSIsIk1JRF9IZWFydEJlYXQiLCJzZW5kIiwiY2xvc2UiLCJoYXNEaXNjb25uZWN0ZWQiLCJzdG9wUmVjb25uZWN0VGltZXIiLCJDbGFzcyIsIkNhblNlbmRNc2ciLCJyZWFkeVN0YXRlIiwiV2ViU29ja2V0IiwiQ09OTkVDVElORyIsIk9QRU4iLCJzd0Nvbm5lY3QiLCJ3c0FkZHIiLCJvbm9wZW4iLCJlIiwib25tZXNzYWdlIiwibXNnaWQiLCJNSURfbG9naW4iLCJrZXkiLCJ0b1N0cmluZyIsIm5vZGV4Iiwibm9kZXkiLCJwbGF5ZXJQcm9wIiwic2Vzc2lvbklkIiwiUGxheWVyU2Vzc2lvbk1hcCIsImhhcyIsInNldCIsIk5ld3BsYXllck1hcCIsIm5ld1BsYXllcklkcyIsInB1c2giLCJsZW5ndGgiLCJNSURfbG9nb3V0IiwiRGVsUGxheWVySWRzIiwiTUlEX21vdmUiLCJNSURfQnVtcCIsInN0YXJQcm9wIiwibmV3U3RhclBvcyIsIm5ld1N0YXJLZXkiLCJNSURfU3RhckJvcm4iLCJNSURfR00iLCJvbmVycm9yIiwib25jbG9zZSIsInNlbmR3c21lc3NhZ2UiLCJDTE9TRUQiLCJDTE9TSU5HIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFJQSxJQUFJQSxNQUFNLEdBQUdDLE9BQU8sQ0FBQyxRQUFELENBQXBCLEVBRUE7OztBQUNBLElBQUlDLFVBQVUs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QUNlLEVBQVAsQ0FBVVksVUFBVixJQUF3QkMsU0FBUyxDQUFDbUMsTUFBbEMsSUFBNEMvRCxNQUFNLENBQUNlLEVBQVAsQ0FBVVksVUFBVixJQUF3QkMsU0FBUyxDQUFDb0MsT0FBbEYsRUFBMkY7QUFBRTtBQUN6RjtBQUNIO0FBQ0osS0FWd0IsQ0FZekI7OztBQUNBaEUsSUFBQUEsTUFBTSxDQUFDZSxFQUFQLENBQVVNLElBQVYsQ0FBZUgsSUFBZjtBQUNIO0FBN05JLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiB3ZWJzb2NrZXQgXHJcbiAqL1xyXG5cclxubGV0IEdsb2JhbCA9IHJlcXVpcmUoXCJjb21tb25cIilcclxuXHJcbi8v5b+D6Lez5qOA5rWLXHJcbnZhciBIZWFydENoZWNrID0ge1xyXG4gICAgdGltZW91dDogNjAwMDAsIC8vNjDnp5JcclxuICAgIHRpbWVvdXRPYmo6IG51bGwsXHJcbiAgICBzZXJ2ZXJUaW1lb3V0T2JqOiBudWxsLFxyXG4gICAgZGlzY29ubmVjdGlvbmVkOiBmYWxzZSxcclxuICAgIHJlY29ubmVjdFRpbWVvdXRvYmo6IG51bGwsXHJcblxyXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRPYmopO1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNlcnZlclRpbWVvdXRPYmopO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydEhlYXJ0QmVhdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMudGltZW91dE9iaiA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8v6L+Z6YeM5Y+R6YCB5LiA5Liq5b+D6Lez77yM5ZCO56uv5pS25Yiw5ZCO77yM6L+U5Zue5LiA5Liq5b+D6Lez5raI5oGv77yMb25tZXNzYWdl5ou/5Yiw6L+U5Zue55qE5b+D6Lez5bCx6K+05piO6L+e5o6l5q2j5bi4XHJcbiAgICAgICAgICAgIGNjLmxvZyhcInNlbmQgaGVhcnQgYmVhdC4uLlwiKVxyXG4gICAgICAgICAgICBpZiAoR2xvYmFsLndzID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9IFxyXG5cclxuICAgICAgICAgICAgdmFyIGJ1ZmYgPSBuZXcgQXJyYXlCdWZmZXIoMTIpXHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gbmV3IFVpbnQzMkFycmF5KGJ1ZmYpXHJcbiAgICBcclxuICAgICAgICAgICAgZGF0YVswXSA9IEdsb2JhbC5NSURfSGVhcnRCZWF0IC8v5raI5oGvSURcclxuICAgICAgICAgICAgZGF0YVsxXSA9IDEgLy/mtojmga/plb/luqZcclxuICAgICAgICAgICAgZGF0YVsyXSA9IDAgLy9hbnl0aGluZyDpmo/mhI/loavlhYXkuIDkuKrmlbBcclxuXHJcbiAgICAgICAgICAgIEdsb2JhbC53cy5zZW5kKGRhdGEpO1xyXG4gICAgICAgICAgICBzZWxmLnNlcnZlclRpbWVvdXRPYmogPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyAvL+W/g+i3s+i2heaXtuS4u+WKqOaWreW8gFxyXG4gICAgICAgICAgICAgICAgY2MubG9nKFwiY2xvc2UgY29ubmVjdGlvbi4uLlwiKVxyXG4gICAgICAgICAgICAgICAgaWYgKEdsb2JhbC53cyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgR2xvYmFsLndzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmRpc2Nvbm5lY3Rpb25lZCA9IHRydWVcclxuICAgICAgICAgICAgfSwgc2VsZi50aW1lb3V0KVxyXG4gICAgICAgIH0sIHRoaXMudGltZW91dClcclxuICAgIH0sXHJcblxyXG4gICAgaGFzRGlzY29ubmVjdGVkOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpc2Nvbm5lY3Rpb25lZFxyXG4gICAgfSxcclxuXHJcbiAgICBzdG9wUmVjb25uZWN0VGltZXI6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy9jYy5sb2coXCJjbG9zZSByZWNvbm5lY3RUaW1lb3V0Li4uXCIpXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVjb25uZWN0VGltZW91dG9iaik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIC8vZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIC8qXHJcbiAgICByZWFkeVN0YXRlOlxyXG4gICAgICAgIENPTk5FQ1RJTkcgMFxyXG4gICAgICAgIE9QRU4gICAgICAgMVxyXG4gICAgICAgIENMT1NJTkcgICAgMlxyXG4gICAgICAgIENMT1NFRCAgICAgM1xyXG4gICAgKi9cclxuICAgXHJcbiAgICBDYW5TZW5kTXNnOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmIChHbG9iYWwud3MgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIChHbG9iYWwud3MucmVhZHlTdGF0ZSA9PSBXZWJTb2NrZXQuQ09OTkVDVElORyB8fCBHbG9iYWwud3MucmVhZHlTdGF0ZSA9PSBXZWJTb2NrZXQuT1BFTilcclxuICAgIH0sIFxyXG5cclxuICAgIHN3Q29ubmVjdDogZnVuY3Rpb24oKXtcclxuICAgICAgICBpZiAoR2xvYmFsLndzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgLy9yZXR1cm5cclxuICAgICAgICAgICAgLy9jYy5sb2coXCJyZWFkeVN0YXRlOiBcIiwgR2xvYmFsLndzLnJlYWR5U3RhdGUpXHJcbiAgICAgICAgICAgIGlmIChHbG9iYWwud3MucmVhZHlTdGF0ZSA9PSBXZWJTb2NrZXQuQ09OTkVDVElORyB8fCBHbG9iYWwud3MucmVhZHlTdGF0ZSA9PSBXZWJTb2NrZXQuT1BFTikgeyAvL+W3sue7j+i/nuS4iuWwseS4jeW/heWGjei/nlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBjYy5sb2coXCJhZGRyOiBcIiwgR2xvYmFsLndzQWRkciwgR2xvYmFsLndzID09IG51bGwpXHJcbiAgICAgICAgdmFyIHdzID0gbmV3IFdlYlNvY2tldChHbG9iYWwud3NBZGRyKTtcclxuICAgICAgICB3cy5vbm9wZW4gPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGNjLmxvZyhcIndzIG9wZW46IFwiLCB3cy5yZWFkeVN0YXRlKVxyXG4gICAgICAgICAgICAvL+WPkemAgeW/g+i3s1xyXG4gICAgICAgICAgICBIZWFydENoZWNrLnJlc2V0KCkuc3RhcnRIZWFydEJlYXQoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd3Mub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog5raI5oGv6Kej5p6QIFxyXG4gICAgICAgICAgICAgKiAwOiDmtojmga9pZFxyXG4gICAgICAgICAgICAgKiAx77ya5raI5oGv6ZW/5bqmXHJcbiAgICAgICAgICAgICAqIDLvvJpzZXNzaW9uaWRcclxuICAgICAgICAgICAgICogM++8mm5vZGV4IHjlnZDmoIfmraPotJ/moIforrBcclxuICAgICAgICAgICAgICogNO+8mm5vZGV4IHjlnZDmoIflgLxcclxuICAgICAgICAgICAgICogNe+8mm5vZGV5IHnlnZDmoIfmraPotJ/moIforrBcclxuICAgICAgICAgICAgICogNu+8mm5vZGV5IHnlnZDmoIflgLwgXHJcbiAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBuZXcgVWludDMyQXJyYXkoZS5kYXRhKVxyXG4gICAgICAgICAgICB2YXIgbXNnaWQgPSBkYXRhWzBdIFxyXG4gICAgICAgICAgICBzd2l0Y2ggKG1zZ2lkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdsb2JhbC5NSURfbG9naW46XHJcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nKFwid3MgbWVzc2FnZSBNSURfbG9naW46IFwiLCBkYXRhWzFdLCBkYXRhWzJdLCBkYXRhWzNdLCBkYXRhWzRdLCBkYXRhWzVdLCBkYXRhWzZdKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBkYXRhWzJdLnRvU3RyaW5nKClcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZXggPSBkYXRhWzRdXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGV5ID0gZGF0YVs2XVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhWzNdID09IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RleCA9IDAgLSBub2RleFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVs1XSA9PSAyKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXkgPSAwIC0gbm9kZXlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBsYXllclByb3AgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25JZDogZGF0YVsyXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXg6IG5vZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RleTogbm9kZXlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEdsb2JhbC5QbGF5ZXJTZXNzaW9uTWFwLmhhcyhrZXkpID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbC5QbGF5ZXJTZXNzaW9uTWFwLnNldChrZXksIHBsYXllclByb3ApXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5OZXdwbGF5ZXJNYXAuc2V0KGtleSwgcGxheWVyUHJvcClcclxuICAgICAgICAgICAgICAgICAgICBHbG9iYWwubmV3UGxheWVySWRzLnB1c2goa2V5KVxyXG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZyhcIndzIG1lc3NhZ2UgTUlEX2xvZ2luOiBcIiwgR2xvYmFsLm5ld1BsYXllcklkcy5sZW5ndGgsIGtleSwgR2xvYmFsLk5ld3BsYXllck1hcC5oYXMoa2V5KSlcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgR2xvYmFsLk1JRF9sb2dvdXQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGRhdGFbMl0udG9TdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZyhcIndzIG1lc3NhZ2UgTUlEX2xvZ291dCwgc2Vzc2lvbmlkOiBcIiwga2V5KVxyXG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5EZWxQbGF5ZXJJZHMucHVzaChrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsLlBsYXllclNlc3Npb25NYXAuZGVsZXRlKGtleSlcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgR2xvYmFsLk1JRF9tb3ZlOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vY2MubG9nKFwid3MgbWVzc2FnZSBNSURfbW92ZTogXCIsIGRhdGFbMV0sIGRhdGFbMl0sIGRhdGFbM10sIGRhdGFbNF0sIGRhdGFbNV0sIGRhdGFbNl0pXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGRhdGFbMl0udG9TdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RleCA9IGRhdGFbNF1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZXkgPSBkYXRhWzZdXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFbM10gPT0gMil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGV4ID0gMCAtIG5vZGV4XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhWzVdID09IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RleSA9IDAgLSBub2RleVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGxheWVyUHJvcCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbklkOiBkYXRhWzJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RleDogbm9kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGV5OiBub2RleVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoR2xvYmFsLlBsYXllclNlc3Npb25NYXAuaGFzKGtleSkgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsLlBsYXllclNlc3Npb25NYXAuc2V0KGtleSwgcGxheWVyUHJvcClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsLk5ld3BsYXllck1hcC5zZXQoa2V5LCBwbGF5ZXJQcm9wKVxyXG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5uZXdQbGF5ZXJJZHMucHVzaChrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nKFwiTUlEX21vdmUgcHVycGxlIG1vbnN0ZXJzOiBcIiwgR2xvYmFsLm5ld1BsYXllcklkcy5sZW5ndGgsIGtleSwgR2xvYmFsLk5ld3BsYXllck1hcC5oYXMoa2V5KSlcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgR2xvYmFsLk1JRF9CdW1wOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vY2MubG9nKFwid3MgbWVzc2FnZSBNSURfQnVtcDogXCIsIGRhdGFbMV0sIGRhdGFbMl0sIGRhdGFbM10sIGRhdGFbNF0sIGRhdGFbNV0sIGRhdGFbNl0pXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogIDA6IOa2iOaBr0lEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDHvvJrmtojmga/plb/luqZcclxuICAgICAgICAgICAgICAgICAgICAgICAgMjog5oiQ5Yqf5aSx6LSl5qCH5b+XICjlpLHotKXliJnlj6rpnIDopoHliY3kuInkuKrlrZfmrrUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDM6IOaYn+aYn3jlnZDmoIfmraPotJ/moIflv5dcclxuICAgICAgICAgICAgICAgICAgICAgICAgNDog5pif5pifeOWdkOagh1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA177ya5pif5pifeeWdkOagh+ato+i0n+agh+W/l1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA277ya5pif5pifeeWdkOagh1xyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVsyXSA9PSAwKXsgLy/lpLHotKVcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nKFwid3MgbWVzc2FnZSBNSURfQnVtcCBmYWlsIC4uLiBcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGV4ID0gZGF0YVs0XVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RleSA9IGRhdGFbNl1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVszXSA9PSAyKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXggPSAwIC0gbm9kZXhcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFbNV0gPT0gMil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGV5ID0gMCAtIG5vZGV5XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFyUHJvcCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXg6IG5vZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RleTogbm9kZXlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsLm5ld1N0YXJQb3Muc2V0KEdsb2JhbC5uZXdTdGFyS2V5LCBzdGFyUHJvcClcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHbG9iYWwuTUlEX0hlYXJ0QmVhdDpcclxuICAgICAgICAgICAgICAgICAgICBjYy5sb2coXCJ3cyBtZXNzYWdlIE1JRF9IZWFydEJlYXQ6IFwiLCBtc2dpZClcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHbG9iYWwuTUlEX1N0YXJCb3JuOlxyXG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZyhcIndzIG1lc3NhZ2UgTUlEX1N0YXJCb3JuOiBcIiwgZGF0YVsyXSwgZGF0YVszXSwgZGF0YVs0XSwgZGF0YVs1XSlcclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiAgMDog5raI5oGvSURcclxuICAgICAgICAgICAgICAgICAgICAgICAgMe+8mua2iOaBr+mVv+W6plxyXG4gICAgICAgICAgICAgICAgICAgICAgICAyOiDmmJ/mmJ945Z2Q5qCH5q2j6LSf5qCH5b+XXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDM6IOaYn+aYn3jlnZDmoIdcclxuICAgICAgICAgICAgICAgICAgICAgICAgNO+8muaYn+aYn3nlnZDmoIfmraPotJ/moIflv5dcclxuICAgICAgICAgICAgICAgICAgICAgICAgNe+8muaYn+aYn3nlnZDmoIdcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZXggPSBkYXRhWzNdXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGV5ID0gZGF0YVs1XVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhWzJdID09IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RleCA9IDAgLSBub2RleFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVs0XSA9PSAyKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXkgPSAwIC0gbm9kZXlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJQcm9wID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RleDogbm9kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGV5OiBub2RleVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBHbG9iYWwubmV3U3RhclBvcy5zZXQoR2xvYmFsLm5ld1N0YXJLZXksIHN0YXJQcm9wKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBjYXNlIEdsb2JhbC5NSURfR006XHJcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nKFwid3MgbWVzc2FnZSBNSURfR00uLi5cIilcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjYy5sb2coXCLmnKrnn6Ug5raI5oGvaWQ6IFwiLCBtc2dpZClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy/lj5HpgIHlv4Pot7NcclxuICAgICAgICAgICAgSGVhcnRDaGVjay5yZXNldCgpLnN0YXJ0SGVhcnRCZWF0KClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdzLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBjYy5sb2coXCJ3cyBlcnJvcjogXCIsIHdzLnJlYWR5U3RhdGUpXHJcbiAgICAgICAgICAgIC8vR2xvYmFsLndzID0gbnVsbFxyXG4gICAgICAgICAgICBpZiAoSGVhcnRDaGVjay5oYXNEaXNjb25uZWN0ZWQoKSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgSGVhcnRDaGVjay5zdG9wUmVjb25uZWN0VGltZXIoKVxyXG4gICAgICAgICAgICAgICAgSGVhcnRDaGVjay5yZWNvbm5lY3RUaW1lb3V0b2JqID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnN3Q29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwMClcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBIZWFydENoZWNrLnN0b3BSZWNvbm5lY3RUaW1lcigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdzLm9uY2xvc2UgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBjYy5sb2coXCJ3cyBjbG9zZTogXCIsIHdzLnJlYWR5U3RhdGUpXHJcbiAgICAgICAgICAgIC8vR2xvYmFsLndzID0gbnVsbFxyXG4gICAgICAgICAgICBpZiAoSGVhcnRDaGVjay5oYXNEaXNjb25uZWN0ZWQoKSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgSGVhcnRDaGVjay5zdG9wUmVjb25uZWN0VGltZXIoKVxyXG4gICAgICAgICAgICAgICAgSGVhcnRDaGVjay5yZWNvbm5lY3RUaW1lb3V0b2JqID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnN3Q29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwMClcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBIZWFydENoZWNrLnN0b3BSZWNvbm5lY3RUaW1lcigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNjLmxvZyhcImdsb2JhbCB3cyBpbml0LCBzdGF0ZTogXCIsIHdzLnJlYWR5U3RhdGUpXHJcbiAgICAgICAgR2xvYmFsLndzID0gd3NcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YSAg5YW35L2T5pWw5o2uLCAx77ya6ZW/5bqm77yMMu+8muaYr+WQpuW5v+aSre+8jDPvvJouLi4g5YW35L2T5raI5oGv5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHNlbmR3c21lc3NhZ2U6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChHbG9iYWwud3MgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChHbG9iYWwud3MgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoR2xvYmFsLndzLnJlYWR5U3RhdGUgPT0gV2ViU29ja2V0LkNMT1NFRCB8fCBHbG9iYWwud3MucmVhZHlTdGF0ZSA9PSBXZWJTb2NrZXQuQ0xPU0lORykgeyAvL+ato+WcqOaWreW8gOaIluiAheW3sue7j+aWreW8gO+8jOWImeS4jeiDveWPkemAgea2iOaBr1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vY2MubG9nKFwid3Mgc2VuZHdzbWVzc2FnZTogXCIsIEdsb2JhbC53cy5yZWFkeVN0YXRlKVxyXG4gICAgICAgIEdsb2JhbC53cy5zZW5kKGRhdGEpXHJcbiAgICB9XHJcbn0pIl19