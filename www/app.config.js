// NOTE object below must be a valid JSON
var appStartView = "WorkShop2";

window.DMAPP = $.extend(true, window.DMAPP, {
  "config": {
    "layoutSet": "simple",
    "navigation": [
      {
        "title": "车间",
        "onExecute": "#" + appStartView,
        "icon": "menu"
      },
      {
        "title": "测试",
        "onExecute": "#EMSChart?CODE_EQP=SXD02",
        "icon": "preferences"
      },
      {
        "title": "设置",
        "onExecute": "#Config",
        "icon": "preferences"
      }
    ]
  }
});