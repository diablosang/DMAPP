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
        },
        buttonFuncClick: function (e) {
            var view = e.component.option("view");
            if (view != "")
            {
                DMAPP.app.navigate(view);
            }
        },
        buttonReportClick: function (e) {
            DMAPP.app.navigate("DMREPORT");
        }
    };

    function BindData(viewModel) {
        try {
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/CallMethod";
            var postData = {
                userName: u,
                methodName: "EMS.Common.GetWorkShop",
                param: ""
            }

            $.ajax({
                type: 'POST',
                data: postData,
                url: url,
                cache: false,
                success: function (data, textStatus) {
                    var gap = 10;
                    var cols = parseInt(8);
                    var pageWidth = 400;
                    var itemWidth = parseInt((pageWidth - gap) / cols - gap);
                    var itemHeight = parseInt(itemWidth / 4 * 3);

                    var divCanvas = $("#divCanvas");
                    divCanvas.empty();
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var itemInfo = {
                            htmlItem: "<div id='item" + item.CODE_LINE + "' class='CavItem'/>",
                            posX: (itemWidth + gap) * (item.POS_X - 1) + gap,
                            posY: (itemHeight + gap) * (item.POS_Y - 1) + gap,
                            w: itemWidth * item.SIZE_W + gap * (item.SIZE_W - 1),
                            h: itemHeight * item.SIZE_H + gap * (item.SIZE_H - 1)
                        };

                        item.itemInfo = itemInfo;
                        BindItem(item, divCanvas);
                    }

                    BindBar();
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

    function BindBar() {
        var sessionStorage = window.sessionStorage;
        var u = sessionStorage.getItem("username");
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/CallMethod";
        var postData = {
            userName: u,
            methodName: "EMS.Common.GetWorkShopBarAuth",
            param: ""
        }

        $.ajax({
            type: 'POST',
            data: postData,
            url: url,
            cache: false,
            success: function (data, textStatus) {
                workShopBarAuth = data;
                for (var i = 0; i < workShopBarAuth.length; i++) {
                    if (workShopBarAuth[i].CODE_MENU.indexOf("WS_1") >= 0) {
                        $("#ws_1").show();
                        continue;
                    }
                    if (workShopBarAuth[i].CODE_MENU.indexOf("WS_2") >= 0) {
                        $("#ws_2").show();
                        continue;
                    }
                    if (workShopBarAuth[i].CODE_MENU.indexOf("WS_3") >= 0) {
                        $("#ws_3").show();
                        continue;
                    }
                    if (workShopBarAuth[i].CODE_MENU.indexOf("WS_4") >= 0) {
                        $("#ws_4").show();
                        continue;
                    }
                    if (workShopBarAuth[i].CODE_MENU.indexOf("WS_5") >= 0) {
                        $("#ws_5").show();
                        continue;
                    }
                }

            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                viewModel.indicatorVisible(false);
                ServerError(xmlHttpRequest.responseText);
            }
        });
    }

    function BindItem(item, divCanvas) {
        var itemInfo = item.itemInfo;
        $(itemInfo.htmlItem).appendTo(divCanvas);
        var divItem = $("#item" + item.CODE_LINE);
        divItem.css("top", itemInfo.posY).css("left", itemInfo.posX).css("width", itemInfo.w).css("height", itemInfo.h);
        divItem.attr('onclick', "OpenWorkShop('" + item.CODE_LINE + "','" + item.DESC_LINE + "','" + item.TYPE + "');");
        var color = "rgb(51, 232, 37)";
        switch (item.TYPE) {
            case "01": color = "rgb(51, 232, 37)"; break;
            case "02": color = "yellow"; break;
            case "03": color = "rgb(238, 121, 89)"; break;
            case "04": color = "rgb(238, 121, 89)"; break;
            case "05": color = "rgb(245, 245, 245)"; break;
        }
        divItem.css("background-color", color);
        var divBox = $("<div class='CavBox'>");
        divBox.appendTo(divItem);

        $("<div class='CavText'>").html(item.CODE_LINE).css("font-size", "20px").appendTo(divBox);
        $("<div class='CavText'>").html(item.DISP_WS).appendTo(divBox);
        $("<div class='CavText'>").html(item.DISP1).appendTo(divBox);
        $("<div class='CavText'>").html(item.DISP2).appendTo(divBox);

        //var titleHtml = "<div id='" + "title" + item.CODE_LINE + "'>";
        //$(titleHtml).appendTo(divItem);
        //var divTitle = $("#title" + item.ITEMID);
        //divTitle.css("text-align", "center").css("width", "100%").css("font-size", "28px");
        //divTitle.text(item.DES1);
        //$("<div>").appendTo(divItem).dxDataGrid(option);


        //for (var i = 0; i < data.length; i++) {
        //    var d = data[i];
        //    if (d.POS_X > maxR) {
        //        maxR = d.POS_X;
        //    }

        //    if (d.POS_Y > maxC) {
        //        maxC = d.POS_Y;
        //    }
        //}

        //for (var r = 1; r <= maxR; r++) {
        //    $('<tr>').attr('id', 'tr_' + r).attr('height', '75px').appendTo(table);
        //    var tr = $("#tr_" + r);
        //    for (var c = 1; c <= maxC; c++) {
        //        //$('<td>').attr('id', 'td_' + r + "_" + c).css('border', '1px solid').css('width', '100px').css('padding','5px 5px 5px 5px').appendTo(tr);
        //        $('<td>').attr('id', 'td_' + r + "_" + c).appendTo(tr);
        //    }
        //}

        //for (var i = 0; i < data.length; i++) {
        //    var d = data[i];
        //    var td = $("#td_" + d.POS_X + "_" + d.POS_Y);
        //    td.attr('CODE_EQP', d.CODE_EQP);
        //    td.attr('align', 'center');
        //    td.attr('valign', 'middle');
        //    td.attr('onclick', "OpenWorkShop('" + d.CODE_LINE + "','" + d.DESC_LINE + "','" + d.TYPE + "');");
            

        //    td.css('border-radius', '7px');
        //    td.css('box-shadow', '3px 3px 3px #888888');
        //    $('<div>').html(d.DISP_WS).appendTo(td);
        //    $('<div>').html(d.DISP1).css("font-size", "small").appendTo(td);
        //    $('<div>').html(d.DISP2).appendTo(td);
        //}
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
            $("#td1").text("Legend:");
            $("#td2").text("Equipment");
            $("#td3").text("QC");
            $("#td4").text("Transfer");
            $("#td5").text("Other");
            
        }
    }

    return viewModel;
};

function OpenWorkShop(CODE_LINE, DESC_LINE, TYPE) {
    if (TYPE == "01") {
        var view = "DeviceTable?CODE_LINE=" + CODE_LINE + "&DESC_LINE=" + DESC_LINE;
        DMAPP.app.navigate(view);
    }
    else if (TYPE == "02") {
        var view = "EQCMenu";
        DMAPP.app.navigate(view);
    }
    else if (TYPE == "03") {
        var view = "TRFEdit";
        DMAPP.app.navigate(view);
    }
    else if(TYPE=="04" ){
        var view = "M_DOC2";
        DMAPP.app.navigate(view);
    }
}