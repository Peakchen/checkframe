
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/login.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '85d2af0NxdLsYumGChyxxL/', 'login');
// scripts/login.js

"use strict";

var Game = require("Game");

var Global = require("common");

var wsNet = require("wsNet");

cc.Class({
  "extends": cc.Component,
  properties: {
    //注册
    registerBtn: {
      "default": null,
      type: cc.Button
    },
    //登陆
    loginBtn: {
      "default": null,
      type: cc.Button
    },
    //用户名
    nameBox: {
      "default": null,
      type: cc.EditBox
    },
    //密码
    pwdBox: {
      "default": null,
      type: cc.EditBox
    },
    //提示信息显示
    tip_info: {
      "default": null,
      type: cc.Label
    }
  },
  getGameObj: function getGameObj() {
    return new Game();
  },
  getwsNetObj: function getwsNetObj() {
    return new wsNet();
  },
  onLoad: function onLoad() {
    cc.log("login init...");
    this.getwsNetObj().swConnect();
    Global.PlayerSessionMap = new Map();
    Global.NewplayerMap = new Map();
    Global.newPlayerIds = new Array();
    Global.DelPlayerIds = new Array();
    this.registerBtn.interactable = false;
    this.loginBtn.interactable = false;
    this.registerBtn.node.on("click", this.onRegister, this);
    this.loginBtn.node.on("click", this.onLogin, this);
    this.nameBox.node.on("text-changed", this.onName, this);
    this.pwdBox.node.on("text-changed", this.onPwd, this);
  },
  // Eventobj.detail 获得组件对象
  onRegister: function onRegister(Eventobj) {
    cc.log("click register...");

    if (this.getwsNetObj().CanSendMsg()) {
      this.sendAccountMessage(Global.MID_Register);
      if (Global.FirstLogin == null) Global.FirstLogin = 1;
      Global.DoRegisterAction = 1;
    }
  },
  onLogin: function onLogin(Eventobj) {
    cc.log("click login...");

    if (this.getwsNetObj().CanSendMsg()) {
      this.sendAccountMessage(Global.MID_login);
      Global.DoLoginAction = 1;
      if (Global.FirstLogin == null) Global.FirstLogin = 1;
    }
  },
  sendAccountMessage: function sendAccountMessage(id) {
    var buffer = new ArrayBuffer(16);
    var msg = new Uint32Array(buffer);
    msg[0] = id;
    msg[1] = 2;
    msg[2] = parseInt(Global.AccountName);
    msg[3] = parseInt(Global.AccountPwd);
    this.getwsNetObj().sendwsmessage(msg);
  },
  onName: function onName(Eventobj) {
    cc.log("edit name: ", Eventobj.string);
    Global.AccountName = Eventobj.string;
    this.checkInputContent();
  },
  onPwd: function onPwd(Eventobj) {
    cc.log("edit pwd: ", Eventobj.string);
    Global.AccountPwd = Eventobj.string;
    this.checkInputContent();
  },
  //切换到主场景
  change2GameMain: function change2GameMain() {
    cc.director.loadScene('game');
  },
  //检查注册结果
  checkRegisterActionResult: function checkRegisterActionResult() {
    if (Global.DoRegisterAction == 1) {
      cc.log("RegisterSucc: ", Global.RegisterSucc);

      if (Global.RegisterSucc == 0) {
        this.tip_info.string = "用户名和密码重复或者错误";
      } else {
        this.tip_info.string = "注册成功";
      }

      Global.DoRegisterAction = 0;
    }
  },
  //检查登陆结果
  checkLoginActionResult: function checkLoginActionResult() {
    if (Global.DoLoginAction == 1) {
      cc.log("LoginSucc: ", Global.LoginSucc);

      if (Global.LoginSucc == 0) {
        this.tip_info.string = "用户名和密码重复或者错误";
      } else {
        this.tip_info.string = "登陆成功"; // 切换场景

        this.change2GameMain();
      }

      Global.DoLoginAction = 0;
    }
  },
  //是否都是数字
  containDigital: function containDigital(str) {
    var reg = new RegExp("^[0-9]*$");
    return reg.test(str);
  },
  //检查输入框内容是否可用
  checkInputContent: function checkInputContent() {
    // if (Global.DoRegisterAction == 0 || Global.DoLoginAction == 0 ){
    //     return
    // }
    var disableShow = true;

    if (Global.AccountName == "" || Global.AccountPwd == "") {
      this.tip_info.string = "用户名或者密码不能为空！！！";
    } else if (this.containDigital(Global.AccountName) && this.containDigital(Global.AccountPwd)) {
      this.tip_info.string = "用户名或者密码不为数字！！！";
    } else if (parseInt(Global.AccountName) > Global.maxDigital || parseInt(Global.AccountPwd) > Global.maxDigital) {
      this.tip_info.string = "用户名或者密码长度超了！！！";
    } else {
      disableShow = false;
    }

    if (!disableShow) {
      this.registerBtn.interactable = true;
      this.loginBtn.interactable = true;
    }
  },
  update: function update(dt) {
    //cc.log("login update...")
    this.checkRegisterActionResult();
    this.checkLoginActionResult();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcbG9naW4uanMiXSwibmFtZXMiOlsiR2FtZSIsInJlcXVpcmUiLCJHbG9iYWwiLCJ3c05ldCIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwicmVnaXN0ZXJCdG4iLCJ0eXBlIiwiQnV0dG9uIiwibG9naW5CdG4iLCJuYW1lQm94IiwiRWRpdEJveCIsInB3ZEJveCIsInRpcF9pbmZvIiwiTGFiZWwiLCJnZXRHYW1lT2JqIiwiZ2V0d3NOZXRPYmoiLCJvbkxvYWQiLCJsb2ciLCJzd0Nvbm5lY3QiLCJQbGF5ZXJTZXNzaW9uTWFwIiwiTWFwIiwiTmV3cGxheWVyTWFwIiwibmV3UGxheWVySWRzIiwiQXJyYXkiLCJEZWxQbGF5ZXJJZHMiLCJpbnRlcmFjdGFibGUiLCJub2RlIiwib24iLCJvblJlZ2lzdGVyIiwib25Mb2dpbiIsIm9uTmFtZSIsIm9uUHdkIiwiRXZlbnRvYmoiLCJDYW5TZW5kTXNnIiwic2VuZEFjY291bnRNZXNzYWdlIiwiTUlEX1JlZ2lzdGVyIiwiRmlyc3RMb2dpbiIsIkRvUmVnaXN0ZXJBY3Rpb24iLCJNSURfbG9naW4iLCJEb0xvZ2luQWN0aW9uIiwiaWQiLCJidWZmZXIiLCJBcnJheUJ1ZmZlciIsIm1zZyIsIlVpbnQzMkFycmF5IiwicGFyc2VJbnQiLCJBY2NvdW50TmFtZSIsIkFjY291bnRQd2QiLCJzZW5kd3NtZXNzYWdlIiwic3RyaW5nIiwiY2hlY2tJbnB1dENvbnRlbnQiLCJjaGFuZ2UyR2FtZU1haW4iLCJkaXJlY3RvciIsImxvYWRTY2VuZSIsImNoZWNrUmVnaXN0ZXJBY3Rpb25SZXN1bHQiLCJSZWdpc3RlclN1Y2MiLCJjaGVja0xvZ2luQWN0aW9uUmVzdWx0IiwiTG9naW5TdWNjIiwiY29udGFpbkRpZ2l0YWwiLCJzdHIiLCJyZWciLCJSZWdFeHAiLCJ0ZXN0IiwiZGlzYWJsZVNob3ciLCJtYXhEaWdpdGFsIiwidXBkYXRlIiwiZHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7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cEQsUUFBTCxDQUFjcUMsTUFBZCxHQUF1QixnQkFBdkI7QUFDSCxLQUZLLE1BRUQ7QUFDRGMsTUFBQUEsV0FBVyxHQUFHLEtBQWQ7QUFDSDs7QUFFRCxRQUFJLENBQUNBLFdBQUwsRUFBa0I7QUFDZCxXQUFLMUQsV0FBTCxDQUFpQm9CLFlBQWpCLEdBQWdDLElBQWhDO0FBQ0EsV0FBS2pCLFFBQUwsQ0FBY2lCLFlBQWQsR0FBNkIsSUFBN0I7QUFDSDtBQUNKLEdBcktJO0FBdUtMd0MsRUFBQUEsTUFBTSxFQUFFLGdCQUFVQyxFQUFWLEVBQWM7QUFDbEI7QUFDQSxTQUFLWix5QkFBTDtBQUNBLFNBQUtFLHNCQUFMO0FBQ0g7QUEzS0ksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsibGV0IEdhbWUgPSByZXF1aXJlKFwiR2FtZVwiKVxyXG5sZXQgR2xvYmFsID0gcmVxdWlyZShcImNvbW1vblwiKVxyXG5sZXQgd3NOZXQgPSByZXF1aXJlKFwid3NOZXRcIilcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy/ms6jlhoxcclxuICAgICAgICByZWdpc3RlckJ0bjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL+eZu+mZhlxyXG4gICAgICAgIGxvZ2luQnRuOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v55So5oi35ZCNXHJcbiAgICAgICAgbmFtZUJveDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy/lr4bnoIFcclxuICAgICAgICBwd2RCb3g6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v5o+Q56S65L+h5oGv5pi+56S6XHJcbiAgICAgICAgdGlwX2luZm86IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEdhbWVPYmo6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBHYW1lKCk7XHJcbiAgICB9LCAgXHJcblxyXG4gICAgZ2V0d3NOZXRPYmo6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgd3NOZXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjYy5sb2coXCJsb2dpbiBpbml0Li4uXCIpXHJcbiAgICAgICAgdGhpcy5nZXR3c05ldE9iaigpLnN3Q29ubmVjdCgpXHJcblxyXG4gICAgICAgIEdsb2JhbC5QbGF5ZXJTZXNzaW9uTWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIEdsb2JhbC5OZXdwbGF5ZXJNYXAgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgR2xvYmFsLm5ld1BsYXllcklkcyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIEdsb2JhbC5EZWxQbGF5ZXJJZHMgPSBuZXcgQXJyYXkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckJ0bi5pbnRlcmFjdGFibGUgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMubG9naW5CdG4uaW50ZXJhY3RhYmxlID0gZmFsc2VcclxuXHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckJ0bi5ub2RlLm9uKFwiY2xpY2tcIiwgdGhpcy5vblJlZ2lzdGVyLCB0aGlzKTtcclxuICAgICAgICB0aGlzLmxvZ2luQnRuLm5vZGUub24oXCJjbGlja1wiLCB0aGlzLm9uTG9naW4sIHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLm5hbWVCb3gubm9kZS5vbihcInRleHQtY2hhbmdlZFwiLCB0aGlzLm9uTmFtZSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5wd2RCb3gubm9kZS5vbihcInRleHQtY2hhbmdlZFwiLCB0aGlzLm9uUHdkLCB0aGlzKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gRXZlbnRvYmouZGV0YWlsIOiOt+W+l+e7hOS7tuWvueixoVxyXG4gICAgb25SZWdpc3RlcjogZnVuY3Rpb24oRXZlbnRvYmope1xyXG4gICAgICAgIGNjLmxvZyhcImNsaWNrIHJlZ2lzdGVyLi4uXCIpXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0d3NOZXRPYmooKS5DYW5TZW5kTXNnKCkpe1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRBY2NvdW50TWVzc2FnZShHbG9iYWwuTUlEX1JlZ2lzdGVyKVxyXG4gICAgICAgICAgICBpZiAoR2xvYmFsLkZpcnN0TG9naW4gPT0gbnVsbCApXHJcbiAgICAgICAgICAgICAgICBHbG9iYWwuRmlyc3RMb2dpbiA9IDFcclxuICAgICAgICAgICAgR2xvYmFsLkRvUmVnaXN0ZXJBY3Rpb24gPSAxXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvZ2luOiBmdW5jdGlvbihFdmVudG9iail7XHJcbiAgICAgICAgY2MubG9nKFwiY2xpY2sgbG9naW4uLi5cIilcclxuICAgICAgICBpZiAodGhpcy5nZXR3c05ldE9iaigpLkNhblNlbmRNc2coKSl7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEFjY291bnRNZXNzYWdlKEdsb2JhbC5NSURfbG9naW4pXHJcbiAgICAgICAgICAgIEdsb2JhbC5Eb0xvZ2luQWN0aW9uID0gMVxyXG4gICAgICAgICAgICBpZiAoR2xvYmFsLkZpcnN0TG9naW4gPT0gbnVsbCApXHJcbiAgICAgICAgICAgICAgICBHbG9iYWwuRmlyc3RMb2dpbiA9IDFcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNlbmRBY2NvdW50TWVzc2FnZTogZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMTYpO1xyXG4gICAgICAgIHZhciBtc2cgPSBuZXcgVWludDMyQXJyYXkoYnVmZmVyKTtcclxuICAgICAgICBtc2dbMF0gPSBpZFxyXG4gICAgICAgIG1zZ1sxXSA9IDJcclxuICAgICAgICBtc2dbMl0gPSBwYXJzZUludChHbG9iYWwuQWNjb3VudE5hbWUpXHJcbiAgICAgICAgbXNnWzNdID0gcGFyc2VJbnQoR2xvYmFsLkFjY291bnRQd2QpXHJcbiAgICAgICAgdGhpcy5nZXR3c05ldE9iaigpLnNlbmR3c21lc3NhZ2UobXNnKVxyXG4gICAgfSxcclxuXHJcbiAgICBvbk5hbWU6IGZ1bmN0aW9uKEV2ZW50b2JqKXtcclxuICAgICAgICBjYy5sb2coXCJlZGl0IG5hbWU6IFwiLCBFdmVudG9iai5zdHJpbmcpXHJcbiAgICAgICAgR2xvYmFsLkFjY291bnROYW1lID0gRXZlbnRvYmouc3RyaW5nXHJcbiAgICAgICAgdGhpcy5jaGVja0lucHV0Q29udGVudCgpXHJcbiAgICB9LFxyXG5cclxuICAgIG9uUHdkOiBmdW5jdGlvbihFdmVudG9iail7XHJcbiAgICAgICAgY2MubG9nKFwiZWRpdCBwd2Q6IFwiLCBFdmVudG9iai5zdHJpbmcpXHJcbiAgICAgICAgR2xvYmFsLkFjY291bnRQd2QgPSBFdmVudG9iai5zdHJpbmdcclxuICAgICAgICB0aGlzLmNoZWNrSW5wdXRDb250ZW50KClcclxuICAgIH0sXHJcblxyXG4gICAgLy/liIfmjaLliLDkuLvlnLrmma9cclxuICAgIGNoYW5nZTJHYW1lTWFpbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnZ2FtZScpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+ajgOafpeazqOWGjOe7k+aenFxyXG4gICAgY2hlY2tSZWdpc3RlckFjdGlvblJlc3VsdDogZnVuY3Rpb24oKXtcclxuICAgICAgICBpZiAoR2xvYmFsLkRvUmVnaXN0ZXJBY3Rpb24gPT0gMSkge1xyXG4gICAgICAgICAgICBjYy5sb2coXCJSZWdpc3RlclN1Y2M6IFwiLCBHbG9iYWwuUmVnaXN0ZXJTdWNjKVxyXG4gICAgICAgICAgICBpZiAoR2xvYmFsLlJlZ2lzdGVyU3VjYyA9PSAwICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aXBfaW5mby5zdHJpbmcgPSBcIueUqOaIt+WQjeWSjOWvhueggemHjeWkjeaIluiAhemUmeivr1wiXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aXBfaW5mby5zdHJpbmcgPSBcIuazqOWGjOaIkOWKn1wiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgR2xvYmFsLkRvUmVnaXN0ZXJBY3Rpb24gPSAwXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL+ajgOafpeeZu+mZhue7k+aenFxyXG4gICAgY2hlY2tMb2dpbkFjdGlvblJlc3VsdDogZnVuY3Rpb24oKXtcclxuICAgICAgICBpZiAoR2xvYmFsLkRvTG9naW5BY3Rpb24gPT0gMSkge1xyXG4gICAgICAgICAgICBjYy5sb2coXCJMb2dpblN1Y2M6IFwiLCBHbG9iYWwuTG9naW5TdWNjKVxyXG4gICAgICAgICAgICBpZiAoR2xvYmFsLkxvZ2luU3VjYyA9PSAwICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aXBfaW5mby5zdHJpbmcgPSBcIueUqOaIt+WQjeWSjOWvhueggemHjeWkjeaIluiAhemUmeivr1wiXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aXBfaW5mby5zdHJpbmcgPSBcIueZu+mZhuaIkOWKn1wiXHJcbiAgICAgICAgICAgICAgICAvLyDliIfmjaLlnLrmma9cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlMkdhbWVNYWluKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBHbG9iYWwuRG9Mb2dpbkFjdGlvbiA9IDBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8v5piv5ZCm6YO95piv5pWw5a2XXHJcbiAgICBjb250YWluRGlnaXRhbDogZnVuY3Rpb24oc3RyKXtcclxuICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChcIl5bMC05XSokXCIpXHJcbiAgICAgICAgcmV0dXJuIHJlZy50ZXN0KHN0cilcclxuICAgIH0sXHJcblxyXG4gICAgLy/mo4Dmn6XovpPlhaXmoYblhoXlrrnmmK/lkKblj6/nlKhcclxuICAgIGNoZWNrSW5wdXRDb250ZW50OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIGlmIChHbG9iYWwuRG9SZWdpc3RlckFjdGlvbiA9PSAwIHx8IEdsb2JhbC5Eb0xvZ2luQWN0aW9uID09IDAgKXtcclxuICAgICAgICAvLyAgICAgcmV0dXJuXHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICB2YXIgZGlzYWJsZVNob3cgPSB0cnVlXHJcbiAgICAgICAgaWYgKEdsb2JhbC5BY2NvdW50TmFtZSA9PSBcIlwiIHx8IEdsb2JhbC5BY2NvdW50UHdkID09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhpcy50aXBfaW5mby5zdHJpbmcgPSBcIueUqOaIt+WQjeaIluiAheWvhueggeS4jeiDveS4uuepuu+8ge+8ge+8gVwiXHJcbiAgICAgICAgfWVsc2UgaWYgKHRoaXMuY29udGFpbkRpZ2l0YWwoR2xvYmFsLkFjY291bnROYW1lKSAmJiB0aGlzLmNvbnRhaW5EaWdpdGFsKEdsb2JhbC5BY2NvdW50UHdkKSkge1xyXG4gICAgICAgICAgICB0aGlzLnRpcF9pbmZvLnN0cmluZyA9IFwi55So5oi35ZCN5oiW6ICF5a+G56CB5LiN5Li65pWw5a2X77yB77yB77yBXCJcclxuICAgICAgICB9ZWxzZSBpZiAoKHBhcnNlSW50KEdsb2JhbC5BY2NvdW50TmFtZSkgPiBHbG9iYWwubWF4RGlnaXRhbCkgfHwgKHBhcnNlSW50KEdsb2JhbC5BY2NvdW50UHdkKSA+IEdsb2JhbC5tYXhEaWdpdGFsKSkge1xyXG4gICAgICAgICAgICB0aGlzLnRpcF9pbmZvLnN0cmluZyA9IFwi55So5oi35ZCN5oiW6ICF5a+G56CB6ZW/5bqm6LaF5LqG77yB77yB77yBXCJcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZGlzYWJsZVNob3cgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkaXNhYmxlU2hvdykge1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyQnRuLmludGVyYWN0YWJsZSA9IHRydWVcclxuICAgICAgICAgICAgdGhpcy5sb2dpbkJ0bi5pbnRlcmFjdGFibGUgPSB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgIC8vY2MubG9nKFwibG9naW4gdXBkYXRlLi4uXCIpXHJcbiAgICAgICAgdGhpcy5jaGVja1JlZ2lzdGVyQWN0aW9uUmVzdWx0KClcclxuICAgICAgICB0aGlzLmNoZWNrTG9naW5BY3Rpb25SZXN1bHQoKVxyXG4gICAgfVxyXG59KSJdfQ==