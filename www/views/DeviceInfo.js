DMAPP.DeviceInfo = function (params) {
    "use strict";

    var viewModel = {
        title: ko.observable(""),
        indicatorVisible: ko.observable(false),
        command: ko.observable(""),
        parentMenu: ko.observable(""),
        viewShown: function () {
            this.title(params.CODE_EQP);
            try {
                GetWinbox(this, params);
                GetMenu(this, params);
            }
            catch (e) {
                DevExpress.ui.notify("该单据未包含明细信息", "error", 1000);
            }
        },
        formOption: {
            colCount: 2,
            items: [
                        {
                            label: { text: "设备编号" },
                            editorOptions: {
                                readOnly: true
                            },
                            dataField: "CODE_EQP",
                            colSpan: 1
                        },
                        {
                            label: { text: "状态" },
                            editorType: "dxLookup",
                            editorOptions: {
                                readOnly: true,
                                dataSource: [
                                    { IDLINE: 0, DES: "运行" },
                                    { IDLINE: 1, DES: "维护" },
                                    { IDLINE: 2, DES: "维修" },
                                    { IDLINE: 3, DES: "大修" },
                                    { IDLINE: 4, DES: "空闲中" }
                                ],
                                displayExpr: "DES",
                                valueExpr: "IDLINE"
                            },
                            dataField: "STATUS_OP",
                            colSpan: 1
                        },
                        {
                            label: { text: "位置" },
                            editorOptions: {
                                readOnly: true
                            },
                            dataField: "POSITION",
                            colSpan: 2
                        }
            ]
        },
        gridOption: {
            dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
            columnAutoWidth: true,
            columns: [
                { dataField: "ID_WO", caption: "工单号", allowEditing: false, allowSorting: false },
                {
                    dataField: "TYPE_OP", caption: "类型", allowEditing: false, allowSorting: false,
                    lookup: {
                        dataSource: [
                            { IDLINE: "11", DES: "上料" },
                            { IDLINE: "12", DES: "下料" },
                            { IDLINE: "13", DES: "加料" },
                            { IDLINE: "31", DES: "压力" },
                            { IDLINE: "32", DES: "主轴转速" },
                            { IDLINE: "33", DES: "料盘转速" },
                            { IDLINE: "51", DES: "产品检验" },
                            { IDLINE: "52", DES: "产品检验结论" },
                            { IDLINE: "53", DES: "辅料检验" },
                            { IDLINE: "54", DES: "辅料检验结论" },
                        ],
                        displayExpr: "DES",
                        valueExpr: "IDLINE",
                    }
                },
                { dataField: "CODE_ITEM", caption: "零件", allowEditing: false, allowSorting: false },
                { dataField: "DESC_ITEM", caption: "描述", allowEditing: false, allowSorting: false},
                { dataField: "QTY_ORD", caption: "计划数量", allowEditing: false, allowSorting: false },
                { dataField: "DATE_START", caption: "加工时间", allowEditing: false, allowSorting: false, dataType: "date", format: "yyyy-MM-dd HH:mm" },
            ],
            selection: {
                mode: "single"
            },
            paging: {
                enabled: false
            }
        },
        tileViewOption: {
            items: [],
            direction: 'vertical',
            height:"100%",
            baseItemHeight: 192,
            baseItemWidth: 192,
            itemMargin: 10,
            itemTemplate: function (itemData, itemIndex, itemElement) {
                var url = $("#WebApiServerURL")[0].value;
                itemElement.append("<div class=\"ItemDesc\">" + itemData.DESC_CH +
                    "</div><div class=\"BKImage\" style=\"background-image: url('" + url + "/images/JGBR/" + itemData.CODE_MENU + ".jpg')\"></div>");
            },
            onItemClick: function(e){
                if (e.itemData.DEVOBJ == "MENU"){
                    this.parentMenu(e.itemData.CODE_MENU);
                    GetMenu(this, params);
                }
                else if (e.itemData.DEVOBJ == "BACK") {
                    this.parentMenu("");
                    GetMenu(this, params);
                }
                else {
                    var view = e.itemData.DEVOBJ + "?NEW=1&DEVPARAM=" + e.itemData.DEVPARAM + "&CODE_EQP=" + params.CODE_EQP;
                    var form = $("#formDevice").dxForm("instance");
                    var formData = form.option("formData");
                    view = view + "&CODE_OP=" + formData.CODE_OP;
                    DMAPP.app.navigate(view);
                }
            },
        },
        buttonClick: function (e) {

        }
    };

    function GetWinbox(viewModel, params) {
        viewModel.indicatorVisible(true);
        var u = sessionStorage.getItem("username");
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetWinboxDataSimple"
        var postData = {
            userName: u,
            func: "EMS_T_OP",
            group: "GADMIN",
            doc: params.CODE_EQP
        }

        $.ajax({
            type: 'POST',
            data: postData,
            url: url,
            cache: false,
            success: function (data, textStatus) {
                viewModel.winbox = data;
                var form = $("#formDevice").dxForm("instance");
                var grid = $("#gridDevice").dxDataGrid("instance");
                for (var i = 0; i < data.length; i++) {
                    if (data[i].IDNUM == "BMAINBLOCK") {
                        form.option("formData", data[i].data[0]);
                        form.repaint();
                    }

                    if (data[i].IDNUM == "BOP") {
                        grid.option({
                            dataSource: data[i].data
                        });

                        grid.repaint();
                    }
                }

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

    function GetMenu(viewModel, params) {
        viewModel.indicatorVisible(true);
        var u = sessionStorage.getItem("username");
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetData"
        var sql = "select * from EMS_B_MENU where isnull(PAR_MENU,'')='"+viewModel.parentMenu()+"' order by DSPIDX";
        var postData = {
            userName: u,
            sql:sql
        }

        $.ajax({
            type: 'POST',
            data: postData,
            url: url,
            cache: false,
            success: function (data, textStatus) {
                var tile = $("#tileMenu").dxTileView("instance");
                var items = data;
                if(viewModel.parentMenu()!=""){
                    var back = { CODE_MENU: "SYS_BACK", DESC_CH: "返回上一层", DEVOBJ: "BACK", DSPIDX: 99 };
                    items.push(back);
                }

                tile.option("items", items);
                tile.repaint();
                var divP = $("#divP")[0];
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


    return viewModel;
};