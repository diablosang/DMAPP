// NOTE object below must be a valid JSON
window.DMAPP = $.extend(true, window.DMAPP, {
  "config": {
      //"layoutSet": "navbar",
      "layoutSet": "simple",
    "navigation": [
      {
        "title": "车间",
        "onExecute": "#WorkShop",
        "icon": "menu"
      },
      {
        "title": "测试",
        "onExecute": "#M_REP?CODE_EQP=G24",
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