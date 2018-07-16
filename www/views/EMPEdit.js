DMAPP.EMPEdit = function (params) {
    "use strict";

    var viewModel = {
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
        winbox: {},
        group:ko.observable(""),
        keepCache: false,
        viewShown: function (e) {
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
                InitView(this, params);
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
            colCount: 3,
            items: [
                {
                    label: { text: "保养开始日期" },
                    dataField: "DATE_PLAN",
                    editorType: "dxDateBox",
                    editorOptions: {
                        formatString:"yyyy-MM-dd",
                        pickerType:"calendar",
                        dateSerializationFormat: "yyyy-MM-dd"
                    },
                    colSpan: 1
                },
                {
                    label: { text: "保养结束日期" },
                    dataField: "DATE_EPLAN",
                    editorType: "dxDateBox",
                    editorOptions: {
                        formatString: "yyyy-MM-dd",
                        pickerType: "calendar",
                        dateSerializationFormat: "yyyy-MM-dd"
                    },
                    colSpan: 1
                },
                {
                    label: { text: "执行人" },
                    dataField: "EMP_PER",
                    editorOptions: {
                        onFocusIn:function(e){
                            OpenDataWindow(this,"EMP_PER","BMAINBLOCK");
                        }
                    },
                    colSpan: 1
                },
                 {
                     label: { text: "结论" },
                     dataField: "EMP_CON",
                     dataWindow: true,
                     colSpan: 3
                 },
            ],
            onFieldDataChanged: function (e) {
                if (this.keepCache == true)
                {
                    MainValueChanged(viewModel,e);
                }
            }
        },
        gridDetailOption: {
            block:"BEMPROJ",
            dateSerializationFormat: "yyyy-MM-dd",
            columnAutoWidth: true,
            columns: [
                { dataField: "LINE_PROJ", caption: "序号", allowEditing: false, allowSorting: false, width: 50 },
                { dataField: "PART_PML", caption: "部位", allowEditing: false, allowSorting: false, width: 100 },
                { dataField: "PROJ_PML", caption: "项目", allowEditing: false, allowSorting: false, width: 300 },
                { dataField: "TIME_PML", caption: "时间", allowEditing: false, allowSorting: false, width: 60 },
                { dataField: "CON_PML", caption: "方法", allowEditing: false, allowSorting: false, width: 60 },
                { dataField: "EMP_SOL", caption: "异常原因解决方案", allowEditing: true, allowSorting: false, },
                 { dataField: "EMP_PER", caption: "执行人", allowEditing: true, allowSorting: false, width: 100, dataWindow:true},
            ],
            editing: {
                allowUpdating: true,
                mode:"row"
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
                SetGridRowIndex("gridDetail",e.rowIndex);
                if (e.column.dataWindow == true)
                {
                    OpenGridDataWindow(this, "gridDetail", e);
                }

            },
            onRowUpdated: function (e) {
                GridRowUpdated(this, "gridDetail", e)
            }
        }
    };

    function InitView(viewModel, params) {
        var toolItems;
        var form = $("#formMain").dxForm("instance");
        var gridDetail = $("#gridDetail").dxDataGrid("instance");

        if (params.DEVPARAM == "PM") {
            toolItems = [
                //{ location: 'before', widget: 'button', name: 'save', options: { text: '保存' } },
                //{ location: 'before', widget: 'button', name: 'A386', options: { text: '提交' } }];
                { name: 'save', text: '保存' },
                { name: 'A386', text: '提交' }
                ];
        }
        else if (params.DEVPARAM == "CONF") {
            //toolItems = [{ location: 'before', widget: 'button', name: 'A462', options: { text: '确认' } }];
            toolItems = [
                { name: 'A462', text: '确认' },
                { name: 'A452', text: '退回' }];
            gridDetail.columnOption("EMP_SOL", "allowEditing", false);
            gridDetail.columnOption("EMP_PER", "allowEditing", false);
            form.option("readOnly", true);
        }
        else if (params.DEVPARAM == "ECOF") {
            var btn = "";
            if (params.STATUS == "TDCF") {
                btn = "A465";
            }
            else {
                btn = "A466";
            }

            toolItems = [
                { name: btn, text: '确认' }
                //{ location: 'before', widget: 'button', name: btn, options: { } }
            ];
            gridDetail.columnOption("EMP_SOL", "allowEditing", false);
            gridDetail.columnOption("EMP_PER", "allowEditing", false);
            form.option("readOnly", true);
        }

        //var toolbar = $("#mainBar").dxToolbar("instance");
        //toolbar.option("items", toolItems);
        var tile = $("#tileBar").dxTileView("instance");
        tile.option("items", toolItems);
        GetWinbox(viewModel, params);
    }

    function GetWinbox(viewModel, params) {
        viewModel.indicatorVisible(true);
        var u = sessionStorage.getItem("username");
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetWinboxDataSimple"
        var groupname = "";
        if (params.DEVPARAM == "PM") {
            groupname = "GDAPR";
        }
        else if (params.DEVPARAM == "CONF") {
            groupname = "GTCOF";
        }
        else if (params.DEVPARAM == "ECOF") {
            if (params.STATUS == "TDCF") {
                groupname = "GTDCF";
            }
            else {
                groupname = "GTECF";
            }
        }

        var postData = {
            userName: u,
            func: "EMS_T_EMP",
            group: groupname,
            doc:params.ID_EMP
        }

        $.ajax({
            type: 'POST',
            data:postData,
            url: url,
            cache: false,
            success: function (data, textStatus) {
                viewModel.winbox = data;
                var form = $("#formMain").dxForm("instance");
                var gridDetail = $("#gridDetail").dxDataGrid("instance");

                for (var i = 0; i < data.length; i++){
                    if (data[i].IDNUM == "BMAINBLOCK") {
                        form.option("formData", data[i].data[0]);
                        form.repaint();
                    }

                    if (data[i].IDNUM == "BEMPROJ") {
                        gridDetail.option("dataSource", data[i].data);
                        gridDetail.refresh();
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

    function BarItemClick(e) {
        var gridDetail = $("#gridDetail").dxDataGrid("instance");
        gridDetail.saveEditData();

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