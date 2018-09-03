DMAPP.WorkShop2 = function (params) {
    "use strict";

    var viewModel = {
        title: ko.observable(""),
        versionChecked: ko.observable(false),
        indicatorVisible: ko.observable(false),
        viewShown: function () {
            SetLanguage();

            try {
                if (device.platform != "Android") {
                    window.JPush.resetBadge();
                }
            }
            catch (e)
            { }


            viewModel.indicatorVisible(true);
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            if (u == null) {
                var view = "Login/1";
                var option = { root: true };
                DMAPP.app.navigate(view, option);
                return;
            }

            BindData(this);
        },
        onLogoffClick: function () {
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");

            if (u == null) {
                return;
            }

            DMAPP.app.viewCache.clear();
            sessionStorage.removeItem("username");
            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/Logoff?UserName=" + u;
            $.ajax({
                type: 'GET',
                url: url,
                cache: false,
                success: function (data, textStatus) {
                    var view = "Login/0";
                    var option = { root: true };
                    DMAPP.app.navigate(view, option);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    ServerError(xmlHttpRequest.responseText);
                }
            });


            return;
        },
        buttonGoClick: function (e) {
            OpenDevice(viewModel);
        }
    };

    function BindData(viewModel) {
        try {
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            var postData = {
                userName: u,
                sql: "select * from V_MFG_B_LINE where isnull(POS_X,0)>0 order by POS_X,POS_Y"
            };

            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetData";
            $.ajax({
                type: 'POST',
                url: url,
                data: postData,
                cache: false,
                success: function (data, textStatus) {
                    var r = 0;
                    var c = 0;
                    var maxR = 0;
                    var maxC = 0;
                    var table = $("#tbWorkShop");
                    table.empty();

                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        if (d.POS_X > maxR) {
                            maxR = d.POS_X;
                        }

                        if (d.POS_Y > maxC) {
                            maxC = d.POS_Y;
                        }
                    }

                    for (var r = 1; r <= maxR; r++) {
                        $('<tr>').attr('id', 'tr_' + r).attr('height', '75px').appendTo(table);
                        var tr = $("#tr_" + r);
                        for (var c = 1; c <= maxC; c++) {
                            //$('<td>').attr('id', 'td_' + r + "_" + c).css('border', '1px solid').css('width', '100px').css('padding','5px 5px 5px 5px').appendTo(tr);
                            $('<td>').attr('id', 'td_' + r + "_" + c).appendTo(tr);
                        }
                    }

                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        var td = $("#td_" + d.POS_X + "_" + d.POS_Y);
                        td.attr('CODE_EQP', d.CODE_EQP);
                        td.attr('align', 'center');
                        td.attr('valign', 'middle');
                        td.attr('onclick', "OpenWorkShop('" + d.CODE_LINE + "','"+d.DESC_LINE+"','"+d.TYPE+"');");
                        if (d.TYPE == "01" || d.TYPE == null) {
                            td.css("background-color", "rgb(51, 232, 37)");
                        }
                        else if (d.TYPE == "02") {
                            td.css("background-color", "yellow");
                        }
                        else if (d.TYPE == "03") {
                            td.css("background-color", "rgb(238, 121, 89)");
                        }
                        else if (d.TYPE == "04") {
                            td.css("background-color", "rgb(238, 121, 89)");
                        }
                        else {
                            td.css("background-color", "rgb(245, 245, 245)");
                        }

                        td.css('border-radius', '7px');
                        td.css('box-shadow', '3px 3px 3px #888888');
                        $('<div>').html(d.DISP_WS).appendTo(td);
                        $('<div>').html(d.DISP1).css("font-size", "small").appendTo(td);
                        $('<div>').html(d.DISP2).appendTo(td);
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    viewModel.indicatorVisible(false);
                    ServerError(xmlHttpRequest.responseText);
                }
            });
        }
        catch (e) {
            DevExpress.ui.notify(e.message, "error", 1000);
        }

    }

    function OpenDevice(viewModel) {
        try {
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            var searchText = $("#txtCODE_EQP").dxTextBox("instance");
            var CODE_EQP = searchText.option("value");
            var postData = {
                userName: u,
                sql: "select * from V_EMS_T_EQP where CODE_EQP='" + CODE_EQP + "'"
            };

            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetData";
            $.ajax({
                type: 'POST',
                url: url,
                data: postData,
                cache: false,
                success: function (data, textStatus) {
                    if (data.length == 0) {
                        DevExpress.ui.notify("该设备号不存在", "error", 1000);
                        return;
                    }

                    var view = "DeviceInfo?CODE_EQP=" + CODE_EQP;
                    DMAPP.app.navigate(view);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    viewModel.indicatorVisible(false);
                    ServerError(xmlHttpRequest.responseText);
                }
            });
        }
        catch (e) {
            DevExpress.ui.notify(e.message, "error", 1000);
        }
    };

    function SetLanguage() {
        if (DeviceLang() == "CHS") {
            viewModel.title("产线列表");
        }
        else {
            viewModel.title("Product Line");
        }
    }

    return viewModel;
};

function OpenWorkShop(CODE_LINE, DESC_LINE, TYPE) {
    if (TYPE == "01" || TYPE == "03") {
        var view = "DeviceTable?CODE_LINE=" + CODE_LINE + "&DESC_LINE=" + DESC_LINE;
        DMAPP.app.navigate(view);
    }
    else if (TYPE == "02") {
        var view = "EQCMenu";
        DMAPP.app.navigate(view);
    }
}