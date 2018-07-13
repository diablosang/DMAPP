window.DMAPP = window.DMAPP || {};

$(function () {
    DevExpress.devices.current({ platform: "generic" });

    $(document).on("deviceready", function () {
        StatusBar.backgroundColorByHexString("#4F94CD");
        //cordova.plugins.backgroundMode.enable();

        navigator.splashscreen.hide();
        if (window.devextremeaddon) {
            window.devextremeaddon.setup();
        }
        $(document).on("backbutton", function () {
            DevExpress.processHardwareBackButton();
        });

        var uuid = device.uuid;
        var sessionStorage = window.sessionStorage;
        sessionStorage.removeItem("uuid");
        sessionStorage.setItem("uuid", uuid);

    });

    function onNavigatingBack(e) {
        if (e.isHardwareButton && !DMAPP.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                window.external.Notify("DevExpress.ExitApp");
                break;
        }
    }

    DMAPP.app = new DevExpress.framework.html.HtmlApplication({
        namespace: DMAPP,
        layoutSet: DevExpress.framework.html.layoutSets[DMAPP.config.layoutSet],
        navigation: DMAPP.config.navigation,
        commandMapping: DMAPP.config.commandMapping
    });
    DMAPP.app.router.register(":view/:id", { view: "WorkShop", id: undefined });
    DMAPP.app.on("navigatingBack", onNavigatingBack);
    DMAPP.app.navigate();

});

