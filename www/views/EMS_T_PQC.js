DMAPP.EMS_T_PQC = function (params) {
    "use strict";

    var viewModel = {
        viewKey: "",
        title: ko.observable(""),
        indicatorVisible: ko.observable(false),
        toolBarOption: {
            items: [
                 { location: 'before', widget: 'button', name: 'A31', options: { text: '提交' } },
            ],
            onItemClick: function (e) {
                BarItemClick(e);
            }
        },
        winbox: {},
        keepCache: false,
        viewShown: function (e) {
            var par = "";
            if (params.DEVPARAM == "51") {
                par = "产品检验";
            }
            else if (params.DEVPARAM == "52") {
                par = "产品检验结论";
            }
            else if (params.DEVPARAM == "53") {
                par = "辅料检验";
            }
            else if (params.DEVPARAM == "54") {
                par = "辅料检验结论";
            }

            var tile = params.CODE_EQP + par;
            viewModel.title(tile);


            this.viewKey = e.viewInfo.key;
            if (viewModel.keepCache == true) {
                viewModel.keepCache = false;
                var viewAction = sessionStorage.getItem("viewAction");
                if (viewAction != null) {
                    sessionStorage.removeItem("viewAction");
                    if (viewAction == "refreshRow") {
                        RefreshData(this);
                    }

                    if (viewAction == "dataWindow") {
                        var param = JSON.parse(sessionStorage.getItem("dwParam"));
                        if (param.blockID == "BMAINBLOCK") {
                            UpdateDataWindow(this);
                        }
                        else {
                            UpdateGridDataWindow(this, "gridDetail");
                        }
                    }
                }
                return;
            }

            try {
                GetWinbox(this, params);
            }
            catch (e) {
                DevExpress.ui.notify("该单据未包含明细信息", "error", 1000);
            }
        },
        viewHidden: function (e) {
            if (viewModel.keepCache == false) {
                var cache = DMAPP.app.viewCache;
                cache.removeView(e.viewInfo.key);
            }
        },
        formOption: {
            items: [
                {
                    label: { text: "参数类型" },
                    dataField: "TYPE_OP",
                    editorType: "dxLookup",
                    editorOptions: {
                        readOnly: true,
                        displayExpr: "DES1",
                        valueExpr: "IDLINE",
                        dataSource: [
                            { IDLINE: "51", DES1: "产品检验" },
                            { IDLINE: "52", DES1: "产品检验结论" },
                            { IDLINE: "53", DES1: "辅料检验" },
                            { IDLINE: "54", DES1: "辅料检验结论" }
                        ]
                    }
                }
            ],
            onFieldDataChanged: function (e) {
                if (this.keepCache == true) {
                    MainValueChanged(viewModel, e);
                }
            }
        },
        tileBarOption: {
            items: [
                { DES: "提交", name: "BTNSUBMIT" }
            ],
            direction: 'vertical',
            height: "100%",
            baseItemHeight: 192,
            baseItemWidth: 192,
            itemMargin: 10,
            itemTemplate: function (itemData, itemIndex, itemElement) {
                var url = $("#WebApiServerURL")[0].value;
                itemElement.append("<div class=\"ItemDesc\">" + itemData.DES +
                    "</div><div class=\"BKImage\" style=\"background-image: url('" + url + "/images/JGBR/SUBMIT.jpg')\"></div>");
            },
            onItemClick: function (e) {
                BarItemClick(e);
            },
        },
    };

    function GetWinbox(viewModel, params) {
        viewModel.indicatorVisible(true);
        var u = sessionStorage.getItem("username");
        var url;
        if (params.NEW == "1") {
            url = $("#WebApiServerURL")[0].value + "/Api/Asapment/NewDocSimple"
            var postData = {
                userName: u,
                func: "EMS_T_PQC",
                group: "GDRAFT",
                initdata: {
                    CODE_EQP: params.CODE_EQP,
                    CODE_OP: params.CODE_OP,
                    TYPE_OP: params.DEVPARAM
                }
            }
        }

        $.ajax({
            type: 'POST',
            data: postData,
            url: url,
            cache: false,
            success: function (data, textStatus) {
                viewModel.winbox = data;
                var form = $("#formMain").dxForm("instance");
                var items = form.option("items");

                if (params.DEVPARAM == "51" || params.DEVPARAM == "51") {
                    var item1 = {
                        label: { text: "尺寸" },
                        dataField: "SIZE",
                        colSpan: 1
                    }

                    var item2 = {
                        label: { text: "圆度" },
                        dataField: "ROUND",
                        colSpan: 1
                    }
                    items.push(item1);
                    items.push(item2);
                }
                else {
                    var item1 = {
                        label: { text: "结论" },
                        dataField: "RESULT",
                        editorType: "dxLookup",
                        editorOptions: {
                            displayExpr: "DES1",
                            valueExpr: "IDLINE",
                            dataSource: [
                                { IDLINE: "合格", DES1: "合格" },
                                { IDLINE: "不合格", DES1: "不合格" },
                            ]
                        },
                        colSpan: 1
                    }

                    var item2 = {
                        label: { text: "意见" },
                        dataField: "COMMENT",
                        colSpan: 1
                    }
                    items.push(item1);
                    items.push(item2);
                }

                form.option("items", items);

                for (var i = 0; i < data.length; i++) {
                    if (data[i].IDNUM == "BMAINBLOCK") {
                        form.option("formData", data[i].data[0]);
                        form.repaint();
                    }
                }

                viewModel.keepCache = true;
                viewModel.indicatorVisible(false);
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                viewModel.indicatorVisible(false);
                if (xmlHttpRequest.responseText == "NO SESSION") {
                    ServerError(xmlHttpRequest.responseText);
                }
                else {
                    DevExpress.ui.notify("无法读取数据", "error", 1000);
                }
            }
        });
    }

    function BarItemClick(e) {
        if (e.itemData.needComment == "1") {
            this.commentVisible(true);
            this.comment(e.itemData.options.text);
            this.commentButton(e.itemData.name);
        }
        else {
            if (e.itemData.EXTPROP != null) {
                if (e.itemData.EXTPROP.RUNAT == "DEVICE") {
                    ButtonClickDevice(e.itemData);
                    return;
                }
            }

            ButtonClick(viewModel, "BMAINBLOCK", e.itemData.name, "", params);
        }
    }

    return viewModel;
};