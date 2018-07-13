DMAPP.ROEEdit = function (params) {
    "use strict";

    var viewModel = {
        viewKey: "",
        title: ko.observable(""),
        indicatorVisible: ko.observable(false),
        tileBarOption: {
            items: [],
            direction: 'vertical',
            height: "100%",
            baseItemHeight: 192,
            baseItemWidth: 192,
            itemMargin: 10,
            itemTemplate: function (itemData, itemIndex, itemElement) {
                var url = $("#WebApiServerURL")[0].value;
                itemElement.append("<div class=\"ItemDesc\">" + itemData.text +
                    "</div><div class=\"BKImage\" style=\"background-image: url('" + url + "/images/JGBR/" + itemData.text + ".jpg')\"></div>");
            },
            onItemClick: function (e) {
                BarItemClick(e);
            }
        },
        detailBarOption: {
            items: [
                { location: 'before', widget: 'button', name: "new", needComment: "0", options: { icon: "add" } }
            ],
            onItemClick: function (e) {
                if (e.itemData.name == "new") {
                    AddNewRow();
                }
            }
        },
        tabOptions: {
            dataSource: [{ text: "故障部位", tid: "1" }, { text: "领用明细", tid: "2" }, { text: "辅修人", tid: "3" }],
            selectedIndex: 0,
            onItemClick: function (e) {
                var $block1 = $("#gridFLOC")[0];
                var $block2 = $("#gridITEM")[0];
                var $block3 = $("#gridROEP")[0];
                if (e.itemData.tid == "1") {
                    $block1.style.display = "block";
                    $block2.style.display = "none";
                    $block3.style.display = "none";
                }
                else if (e.itemData.tid == "2") {
                    $block2.style.display = "block";
                    $block1.style.display = "none";
                    $block3.style.display = "none";
                }
                else {
                    $block3.style.display = "block";
                    $block1.style.display = "none";
                    $block2.style.display = "none";
                }

                //var scroll = $("#scrollView").dxScrollView("instance");
                //scroll.update();
            }
        },
        winbox: {},
        keepCache: false,
        viewShown: function (e) {
            this.viewKey = e.viewInfo.key;
            viewModel.title(params.ID_EMP);

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
                        switch (param.blockID) {
                            case "BMAINBLOCK": UpdateDataWindow(this); break;
                            case "BFLOC": UpdateGridDataWindow(this, "gridFLOC"); break;
                            case "BDETAIL": UpdateGridDataWindow(this, "gridITEM"); break;
                            case "BAMS": UpdateGridDataWindow(this, "gridROEP"); break;
                        }
                    }
                }
                return;
            }

            try {
                InitView(this,params);
            }
            catch (e) {
                DevExpress.ui.notify("该单据未包含明细信息", "error", 1000);
            }
        },
        viewHidden: function (e) {
            if (viewModel.keepCache == false) {
                var cache = DMAPP.app.viewCache;
                cache.removeView(this.viewKey);
            }
        },
        formOption: {
            colCount: 3,
            onFieldDataChanged: function (e) {
                if (this.keepCache == true) {
                    MainValueChanged(viewModel, e);
                }
            }
        },
        gridFLOCOption: {
            block: "BFLOC",
            dateSerializationFormat: "yyyy-MM-dd",
            columnAutoWidth: true,
            columns: [
                { dataField: "LINE_FLOC", caption: "行号", allowEditing: false, allowSorting: false, width: 50 },
                { dataField: "DESC_FLOCP1", caption: "故障部位1", allowEditing: true, allowSorting: false, width: 200, dataWindow: true },
                { dataField: "DESC_FLOCP2", caption: "故障部位2", allowEditing: true, allowSorting: false, width: 200, dataWindow: true },
                { dataField: "DESC_FLOC", caption: "故障部位3", allowEditing: true, allowSorting: false, width: 200, dataWindow: true },
                { dataField: "AN_ROE", caption: "报警号", allowEditing: true, allowSorting: false, width: 100 },
            ],
            editing: {
                allowUpdating: true,
                allowDeleting: true,
                mode: "row"
            },
            selection: {
                mode: "single"
            },
            paging: {
                enabled: false
            },
            currentRow: 0,
            onRowClick: function (e) {
                var grid = e.component;
                var row = e.rowIndex;
                grid.editRow(row);
            },
            onCellClick: function (e) {
                SetGridRowIndex("gridFLOC", e.rowIndex);
                if (e.column.dataWindow == true) {
                    OpenGridDataWindow(this, "gridFLOC", e);
                }
            },
            onRowUpdated: function (e) {
                GridRowUpdated(this, "gridFLOC", e)
            },
            onRowInserted: function (e) {
                GridRowInsert(this, "gridFLOC", e)
            },
            onRowRemoving: function (e) {
                GridRowDelete(this, "gridFLOC", e)
            }
        },
        gridITEMOption: {
            block: "BDETAIL",
            dateSerializationFormat: "yyyy-MM-dd",
            columnAutoWidth: true,
            columns: [
               { dataField: "LINE_RLOSP", caption: "行号", allowEditing: false, allowSorting: false, width: 50 },
               { dataField: "CODE_ITEM", caption: "物料代码", allowEditing: true, allowSorting: false, width: 100, dataWindow: true },
               { dataField: "DESC_ITEM", caption: "物料描述", allowEditing: false, allowSorting: false, width: 200 },
               { dataField: "SPEC_ITEM", caption: "规格", allowEditing: false, allowSorting: false, width: 100 },
               { dataField: "MODEL_ITEM", caption: "型号", allowEditing: false, allowSorting: false, width: 100 },
               { dataField: "QTY_REQ", caption: "需求数量", allowEditing: true, allowSorting: false, width: 100 },
               { dataField: "CODE_LOC", caption: "货架", allowEditing: true, allowSorting: false, width: 100 },
               { dataField: "REMARK", caption: "备注", allowEditing: true, allowSorting: false, width: 100 },
            ],
            editing: {
                allowDeleting: true,
                allowUpdating: true,
                mode: "row"
            },
            selection: {
                mode: "single"
            },
            paging: {
                enabled: false
            },
            currentRow: 0,
            onRowClick: function (e) {
                var grid = e.component;
                var row = e.rowIndex;
                grid.editRow(row);
            },
            onCellClick: function (e) {
                SetGridRowIndex("gridITEM", e.rowIndex);
                if (e.column.dataWindow == true) {
                    OpenGridDataWindow(this, "gridITEM", e);
                }

            },
            onRowUpdated: function (e) {
                GridRowUpdated(this, "gridITEM", e)
            },
            onRowInserted: function (e) {
                GridRowInsert(this, "gridITEM", e)
            },
            onRowRemoving: function (e) {
                GridRowDelete(this, "gridITEM", e)
            }
        },
        gridROEPOption: {
            block: "BAMS",
            dateSerializationFormat: "yyyy-MM-dd",
            columnAutoWidth: true,
            columns: [
                { dataField: "LINE_ROEP", caption: "行号", allowEditing: false, allowSorting: false, width: 50 },
                { dataField: "DRL_ROEP", caption: "辅修人", allowEditing: true, allowSorting: false, width: 100, dataWindow: true }
            ],
            editing: {
                allowUpdating: true,
                allowDeleting: true,
                mode: "row"
            },
            selection: {
                mode: "single"
            },
            paging: {
                enabled: false
            },
            currentRow: 0,
            onRowClick: function (e) {
                var grid = e.component;
                var row = e.rowIndex;
                grid.editRow(row);
            },
            onCellClick: function (e) {
                SetGridRowIndex("gridROEP", e.rowIndex);
                if (e.column.dataWindow == true) {
                    OpenGridDataWindow(this, "gridROEP", e);
                }

            },
            onRowUpdated: function (e) {
                GridRowUpdated(this, "gridROEP", e)
            },
            onRowInserted: function (e) {
                GridRowInsert(this, "gridROEP", e)
            },
            onRowRemoving: function (e) {
                GridRowDelete(this, "gridROEP", e)
            }
        },
        started: false
    };

    function InitView(viewModel, params) {
        var formItems;
        var toolItems;

        if (params.DEVPARAM == "START") {
            formItems = [
                {
                    label: { text: "故障现象1" },
                    dataField: "DESC_FP",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_FP", "BMAINBLOCK");
                        }
                    },
                    dataWindow: true,
                    colSpan: 3
                },
                {
                    label: { text: "故障现象2" },
                    dataField: "DESC_FP2",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_FP2", "BMAINBLOCK");
                        }
                    },
                    dataWindow: true,
                    colSpan: 3
                },
                {
                    label: { text: "故障现象3" },
                    dataField: "DESC_FP3",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_FP3", "BMAINBLOCK");
                        }
                    },
                    dataWindow: true,
                    colSpan: 3
                },
                {
                    label: { text: "故障现象4" },
                    dataField: "DESC_FP4",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_FP4", "BMAINBLOCK");
                        }
                    },
                    dataWindow: true,
                    colSpan: 3
                },
                {
                    label: { text: "故障现象5" },
                    dataField: "DESC_FP5",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_FP5", "BMAINBLOCK");
                        }
                    },
                    dataWindow: true,
                    colSpan: 3
                },
                {
                    label: { text: "备注" },
                    dataField: "REMARK_F",
                    editorOptions: {
                        readOnly: true
                    },
                    colSpan: 3
                }
            ]

            toolItems = [{ name: 'BTNSUBMIT', text: '提交' }];
        }
        else if (params.DEVPARAM == "APPLY") {
            formItems = [
                {
                    label: { text: "类型" },
                    editorType: "dxLookup",
                    editorOptions: {
                        displayExpr: "DES1",
                        valueExpr: "IDLINE",
                        dataSource: [
                            { IDLINE: "2", DES: "巡检" },
                            { IDLINE: "3", DES: "项修" },
                            { IDLINE: "4", DES: "大修" }
                        ]
                    },
                    dataField: "TYPE_ROE",
                    colSpan: 1
                },
                {
                    label: { text: "预计时间（小时）" },
                    dataField: "PER_PLAN",
                    editorType: "dxNumberBox",
                    colSpan: 1
                },
                {
                    itemType: "empty",
                    colSpan: 1
                },
                {
                    label: { text: "故障现象1" },
                    dataField: "DESC_FP",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_FP", "BMAINBLOCK");
                        }
                    },
                    dataWindow: true,
                    colSpan: 3
                },
                {
                    label: { text: "故障现象2" },
                    dataField: "DESC_FP2",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_FP2", "BMAINBLOCK");
                        }
                    },
                    dataWindow: true,
                    colSpan: 3
                },
                {
                    label: { text: "故障现象3" },
                    dataField: "DESC_FP3",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_FP3", "BMAINBLOCK");
                        }
                    },
                    dataWindow: true,
                    colSpan: 3
                },
                {
                    label: { text: "故障现象4" },
                    dataField: "DESC_FP4",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_FP4", "BMAINBLOCK");
                        }
                    },
                    dataWindow: true,
                    colSpan: 3
                },
                {
                    label: { text: "故障现象5" },
                    dataField: "DESC_FP5",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_FP5", "BMAINBLOCK");
                        }
                    },
                    dataWindow: true,
                    colSpan: 3
                },
                {
                    label: { text: "备注" },
                    dataField: "REMARK_F",
                    colSpan: 3
                }
            ]

            toolItems = [{ name: 'BTNSUBMIT', text: '提交' }];
        }
        else if (params.DEVPARAM == "REPAIR") {
            formItems = [
                {
                    label: { text: "主修人" },
                    dataField: "MR_ROE",
                    editorOptions: {
                        readOnly: true,
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "MR_ROE", "BMAINBLOCK");
                        }
                    },
                    dataWindow: true,
                    colSpan: 1
                },
                {
                    label: { text: "开始时间" },
                    dataField: "DATE_BEG",
                    editorType: "dxDateBox",
                    editorOptions: {
                        readOnly: true,
                        type: "datetime",
                        formatString: "yyyy-MM-dd HH:mm",
                        pickerType: "calendar",
                        dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss"
                    },
                    colSpan: 1
                },
                {
                    label: { text: "结束时间" },
                    dataField: "DATE_END",
                    editorType: "dxDateBox",
                    editorOptions: {
                        readOnly: true,
                        type: "datetime",
                        formatString: "yyyy-MM-dd HH:mm",
                        pickerType: "calendar",
                        dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss"
                    },
                    colSpan: 1
                },
                {
                    label: { text: "维修动作" },
                    dataField: "DESC_MA",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_MA", "BMAINBLOCK");
                        }
                    },
                    colSpan: 1
                },
                {
                    label: { text: "维修结论" },
                    dataField: "DESC_MC",
                    editorOptions: {
                        onFocusIn: function (e) {
                            OpenDataWindow(this, "DESC_MC", "BMAINBLOCK");
                        }
                    },
                    colSpan: 2
                },
                {
                    label: { text: "备注" },
                    dataField: "REMARK_M",
                    colSpan: 3
                }
            ]

            $("#divDetail")[0].style.display = "block";

            toolItems = [
                { name: 'save', text: '保存' },
                { name: 'BTNFIN', text: '完成' },
                { name: 'BTNDSUP', text: '外协' },
            ];
        }

        var form = $("#formMain").dxForm("instance");
        form.option("items", formItems);
        form.repaint();

        var tile = $("#tileBar").dxTileView("instance");
        tile.option("items", toolItems);
        GetWinbox(viewModel, params);
    }

    function GetWinbox(viewModel, params) {
        viewModel.indicatorVisible(true);
        var u = sessionStorage.getItem("username");
        var url;
        var idata = {};
        var groupid = "";
        if (params.DEVPARAM == "REPAIR") {
            groupid = "GTURP";
        }
        else {
            groupid = "GPADLIST"
        }

        if (params.NEW == "1") {
            url = $("#WebApiServerURL")[0].value + "/Api/Asapment/NewDocSimple"
            var postData = {
                userName: u,
                func: "EMS_T_ROE",
                group: "GNDRF",
                initdata: {
                    CODE_EQP: params.CODE_EQP
                }
            }
        }
        else {
            url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetWinboxDataSimple"
            var postData = {
                userName: u,
                func: "EMS_T_ROE",
                group: groupid,
                doc: params.ID_ROE
            };
        }


        $.ajax({
            type: 'POST',
            data: postData,
            url: url,
            cache: false,
            success: function (data, textStatus) {
                viewModel.winbox = data;
                var form = $("#formMain").dxForm("instance");
                var gridFLOC = $("#gridFLOC").dxDataGrid("instance");
                var gridITEM = $("#gridITEM").dxDataGrid("instance");
                var gridROEP = $("#gridROEP").dxDataGrid("instance");

                for (var i = 0; i < data.length; i++) {
                    if (data[i].IDNUM == "BMAINBLOCK") {
                        form.option("formData", data[i].data[0]);
                        form.repaint();
                    }

                    if (data[i].IDNUM == "BFLOC") {
                        gridFLOC.option("dataSource", data[i].data);
                        gridFLOC.refresh();
                    }

                    if (data[i].IDNUM == "BDETAIL") {
                        gridITEM.option("dataSource", data[i].data);
                        gridITEM.refresh();
                    }

                    if (data[i].IDNUM == "BAMS") {
                        gridROEP.option("dataSource", data[i].data);
                        gridROEP.refresh();
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
        switch (e.itemData.name) {
            case "BTNSTART": Start(); break;
            case "BTNEND": Finish(); break;
            case "BTNUP": Up(); break;
            case "BTNOUT": Out(); break;
            default: {
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
                break;
            }
        }
    }

    function Start() {
        viewModel.indicatorVisible(true);
        var u = sessionStorage.getItem("username");
        var form = $("#formMain").dxForm("instance");
        var formData = form.option("formData");
        var status = formData.STATUS;
        viewModel.started = true;
        var date = GetDateTimeString();

        if (status == "TURP") {
            if (formData.DATE_BEG == null) {
                form.updateData("DATE_BEG", date);
                form.updateData("MR_ROE", u);
            }
        }
        else if (status == "TERP") {
            if (formData.DATE_BEGE == null) {
                form.updateData("DATE_BEGE", date);
                form.updateData("ENGR_ROE", u);
            }

        }
        else if (status == "TMRP") {
            if (formData.DATE_BEGM == null) {
                form.updateData("DATE_BEGM", date);
                form.updateData("SUPR_ROE", u);
            }

        }

        var postData = {
            userName: u,
            command: "ROE.START"
        }
        var url = $("#WebApiServerURL")[0].value + "/Api/IRCZ/Command";
        $.ajax({
            type: 'POST',
            data: postData,
            url: url,
            cache: false,
            success: function (data, textStatus) {
                SetStatus(viewModel);
                viewModel.indicatorVisible(false);
                DevExpress.ui.notify("维修开始", "success", 1000);
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                viewModel.indicatorVisible(false);
                if (xmlHttpRequest.responseText == "NO SESSION") {
                    ServerError(xmlHttpRequest.responseText);
                }
                else {
                    DevExpress.ui.notify("错误", "error", 1000);
                }
            }
        });



    }

    function Finish() {
        viewModel.indicatorVisible(true);
        var u = sessionStorage.getItem("username");
        var form = $("#formMain").dxForm("instance");
        var formData = form.option("formData");
        var status = formData.STATUS;
        viewModel.started = true;
        var date = GetDateTimeString();

        if (status == "TURP") {
            if (formData.DATE_BEG == null || formData.DESC_MA == "" || formData.DESC_MA == null || formData.DESC_MC == "" || formData.DESC_MC == null) {
                DevExpress.ui.notify("请填写必须内容", "error", 2000);
                return;
            }

            form.updateData("DATE_END", date);
        }
        else if (status == "TERP") {
            if (formData.DATE_BEGE == null || formData.DESC_MAE == "" || formData.DESC_MAE == null || formData.DESC_MCE == "" || formData.DESC_MCE == null) {
                DevExpress.ui.notify("请填写必须内容", "error", 2000);
                return;
            }

            form.updateData("DATE_ENDE", date);
        }
        else if (status == "TMRP") {
            if (formData.DATE_BEGM == null || formData.DESC_MAM == "" || formData.DESC_MAM == null || formData.DESC_MCM == "" || formData.DESC_MCM == null) {
                DevExpress.ui.notify("请填写必须内容", "error", 2000);
                return;
            }

            form.updateData("DATE_ENDM", date);
        }

        form.updateData("STATUS", "TCOF");

        var postData = {
            userName: u,
            command: "ROE.FINISH"
        }
        var url = $("#WebApiServerURL")[0].value + "/Api/IRCZ/Command";
        $.ajax({
            type: 'POST',
            data: postData,
            url: url,
            cache: false,
            success: function (data, textStatus) {
                viewModel.indicatorVisible(false);
                DevExpress.ui.notify("维修完成", "success", 1000);
                var cache = DMAPP.app.viewCache;
                cache.removeView(viewModel.viewKey);
                (new DevExpress.framework.dxCommand({ onExecute: "#_back" })).execute();
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                viewModel.indicatorVisible(false);
                if (xmlHttpRequest.responseText == "NO SESSION") {
                    ServerError(xmlHttpRequest.responseText);
                }
                else {
                    DevExpress.ui.notify("错误", "error", 1000);
                }
            }
        });



    }

    function Up() {
        viewModel.indicatorVisible(true);
        var u = sessionStorage.getItem("username");
        var form = $("#formMain").dxForm("instance");
        var formData = form.option("formData");
        var status = formData.STATUS;
        viewModel.started = true;
        var date = GetDateTimeString();
        var toStatus = "";
        if (status == "TURP") {
            if (formData.DATE_BEG == null) {
                DevExpress.ui.notify("维修尚未开始", "error", 2000);
                return;
            }
            form.updateData("DATE_END", date);
            toStatus = "TERP";
        }
        else if (status == "TERP") {
            if (formData.DATE_BEGE == null) {
                DevExpress.ui.notify("维修尚未开始", "error", 2000);
                return;
            }

            form.updateData("DATE_ENDE", date);
            toStatus = "TMRP";
        }
        else if (status == "TMRP") {
            if (formData.DATE_BEGM == null) {
                DevExpress.ui.notify("维修尚未开始", "error", 2000);
                return;
            }

            form.updateData("DATE_ENDM", date);
            toStatus = "DSUP";
        }

        var postData = {
            userName: u,
            command: "ROE.UP",
            status: toStatus
        }
        var url = $("#WebApiServerURL")[0].value + "/Api/IRCZ/Command";
        $.ajax({
            type: 'POST',
            data: postData,
            url: url,
            cache: false,
            success: function (data, textStatus) {
                viewModel.indicatorVisible(false);
                DevExpress.ui.notify("上报完成", "success", 1000);
                var cache = DMAPP.app.viewCache;
                cache.removeView(viewModel.viewKey);
                (new DevExpress.framework.dxCommand({ onExecute: "#_back" })).execute();
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                viewModel.indicatorVisible(false);
                if (xmlHttpRequest.responseText == "NO SESSION") {
                    ServerError(xmlHttpRequest.responseText);
                }
                else {
                    DevExpress.ui.notify("错误", "error", 1000);
                }
            }
        });
    }

    function Out() {
        viewModel.indicatorVisible(true);
        var u = sessionStorage.getItem("username");
        var form = $("#formMain").dxForm("instance");
        var formData = form.option("formData");
        var status = formData.STATUS;
        viewModel.started = true;
        var date = GetDateTimeString();
        var toStatus = "";

        var postData = {
            userName: u,
            command: "ROE.OUT"
        }
        var url = $("#WebApiServerURL")[0].value + "/Api/IRCZ/Command";
        $.ajax({
            type: 'POST',
            data: postData,
            url: url,
            cache: false,
            success: function (data, textStatus) {
                viewModel.indicatorVisible(false);
                DevExpress.ui.notify("委外成功", "success", 1000);
                var cache = DMAPP.app.viewCache;
                cache.removeView(viewModel.viewKey);
                (new DevExpress.framework.dxCommand({ onExecute: "#_back" })).execute();
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                viewModel.indicatorVisible(false);
                if (xmlHttpRequest.responseText == "NO SESSION") {
                    ServerError(xmlHttpRequest.responseText);
                }
                else {
                    DevExpress.ui.notify("错误", "error", 1000);
                }
            }
        });
    }

    function AddNewRow() {
        viewModel.indicatorVisible(true);

        var tab = $("#tabDetail").dxTabs("instance");
        var index = tab.option("selectedIndex");
        var grid;
        if (index == "0") {
            grid = $("#gridFLOC").dxDataGrid("instance");
        }
        else if (index == "1") {
            grid = $("#gridITEM").dxDataGrid("instance");
        }
        else {
            grid = $("#gridROEP").dxDataGrid("instance");
        }

        var u = sessionStorage.getItem("username");
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/AddNewRow";
        var postData = {
            blockID: grid.option("block"),
            userName: u
        }

        $.ajax({
            type: 'POST',
            url: url,
            data: postData,
            cache: false,
            success: function (data, textStatus) {
                var ds = grid.option("dataSource");
                ds.push(data[0]);
                grid.option("dataSource", ds);
                viewModel.indicatorVisible(false);
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                viewModel.indicatorVisible(false);
                ServerError(xmlHttpRequest.responseText);
            }
        });
    }

    return viewModel;
};