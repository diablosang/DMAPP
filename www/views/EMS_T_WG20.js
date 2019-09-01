﻿DMAPP.EMS_T_WG20 = function (params) {
    "use strict";

    var viewModel = {
        viewKey: "",
        title: ko.observable(""),
        indicatorVisible: ko.observable(false),
        winbox: {},
        keepCache: false,
        viewShown: function (e) {
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
                DevExpress.ui.notify(SysMsg.noDetail, "error", 1000);
            }
        },
        viewHidden: function (e) {
            if (viewModel.keepCache == false) {
                var cache = DMAPP.app.viewCache;
                cache.removeView(e.viewInfo.key);
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
        formOption: {
            items: [
                {
                    id: "ID_WO",
                    label: { text: "工单" },
                    dataField: "ID_WO",
                    colSpan: 1
                }
            ],
            onFieldDataChanged: function (e) {
                if (this.keepCache == true) {
                    MainValueChanged(viewModel, e);
                }
            }
        },
        gridDetailOption: {
            block: "BDETAIL",
            dateSerializationFormat: "yyyy-MM-dd",
            columnAutoWidth: false,
            columns: [
                { dataField: "BOXNO", caption: "箱号", allowEditing: true, allowSorting: false, width: 100 },
                { dataField: "CODE_ITEM", caption: "物料号", allowEditing: false, allowSorting: false, width: 150 },
                { dataField: "CODE_LOT", caption: "炉号", allowEditing: false, allowSorting: false, width: 200 },
                { dataField: "QTY_WT", caption: "重量", allowEditing: true, allowSorting: false, width: 100, dataType:'number' }
            ],
            editing: {
                allowDeleting: true,
                allowUpdating: true,
                mode: "cell"
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
                SetGridRowIndex("gridDetail", e.rowIndex);
                if (e.column.dataWindow == true) {
                    OpenGridDataWindow(this, "gridDetail", e);
                }

            },
            onRowUpdated: function (e) {
                var idx = e.component.getRowIndexByKey(e.key);
                e.rowIndex = idx;
                GridRowUpdated(this, "gridDetail", e)
            },
            onRowInserted: function (e) {
                GridRowInsert(this, "gridDetail", e)
            },
            onRowRemoving: function (e) {
                if (GridRowDelete(this, "gridDetail", e) == false) {
                    e.cancel = true;
                }
            }
        },
        tileBarOption: {
            items: [
                { DES: SysMsg.submit, name: "BTNSUBMIT" }
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
        }
    };

    function GetWinbox(viewModel, params) {
        viewModel.indicatorVisible(true);
        var u = sessionStorage.getItem("username");
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/NewDocSimple"
        var postData = {
            userName: u,
            func: "EMS_T_WG",
            group: "GDRAFT",
            initdata: {
                CODE_OP:"20"
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
                var gridDetail = $("#gridDetail").dxDataGrid("instance");
                for (var i = 0; i < data.length; i++) {
                    if (data[i].IDNUM == "BMAINBLOCK") {
                        form.option("formData", data[i].data[0]);
                        form.repaint();
                    }

                    
                    if (data[i].IDNUM == "BDETAIL") {
                        gridDetail.option("dataSource", data[i].data);
                        gridDetail.refresh();
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
                    DevExpress.ui.notify(SysMsg.nodata, "error", 1000);
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

            ValidChange();
            setTimeout(function () {
                var par = { _noback: "1" };
                var result = ButtonClick(viewModel, "BMAINBLOCK", e.itemData.name, "", par);
                if (result == true) {
                    DevExpress.ui.notify(SysMsg.subSuccess, "success", 1000);
                    viewModel.keepCache = false;
                    GetWinbox(viewModel, params);
                }
            }, 200);
        }
    }

    function AddNewRow() {
        viewModel.indicatorVisible(true);
        var grid = $("#gridDetail").dxDataGrid("instance");
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

    function ValidChange() {
        var gridDetail = $("#gridDetail").dxDataGrid("instance");
        gridDetail.closeEditCell();
    }

    return viewModel;
};