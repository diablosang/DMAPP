﻿// NOTE object below must be a valid JSON
var appStartView = "WorkShop2";
var keepPopUserInfo = false;
var appVer = "1.29.3";
var dbProfile = "JGBR";
var asUserList = [];
var nullDeviceType = "PC";
var asListData = {};
var workShopBarAuth = [];


window.DMAPP = $.extend(true, window.DMAPP, {
    "config": {
        //"layoutSet": "navbar",
        "layoutSet": "simple",
        "navigation": [
          {
              "title": "车间",
              "onExecute": "#" + appStartView,
              "icon": "menu"
          },
          {
              "title": "测试",
              "onExecute": "#EMSChart2?CODE_EQP=G-03",
              "icon": "preferences"
          },
          {
              "title": "设置",
              "onExecute": "#Config",
              "icon": "preferences"
          }
        ],
        "commandMapping": {
            "generic-header-toolbar": {
                defaults: {
                    'showIcon': true,
                    'location': 'before'
                },
                commands: [
                    {
                        id: 'cmdHome',
                        title: "",
                        icon: "home"
                    },
                    {
                        id: 'cmdFieldSelect',
                        title: "选择字段"
                    }
                ]
            }
        }
            
        
    }
});