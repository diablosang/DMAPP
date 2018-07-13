function createListControl(field, readonly, block) {
    var col = {
        dataField: field.FIELDNAME,
        caption: field.DES,
        allowEditing: !readonly,
        allowSorting: false
    };

    switch (field.CTRLTYPE) {

        case "2": {
            if (field.DS_DATA.length > 0) {
                col.lookup = {
                    dataSource: field.DS_DATA,
                    displayExpr: "DES",
                    valueExpr: "IDLINE",
                };
            }
            break;
        }
        case "3": {
            col.dataType = "boolean";
            break;
        }
        case "4": {
            col.dataType = "date";
            break;
        }
        case "7": {
            col.dataType = "number";
            break;
        }
        case "8": {
            col.dataWindow = true;
            break;
        }
    }

    return col;
}

function createMainControl(id, $parent, field, option) {
    var feID = id;

    switch (field.CTRLTYPE) {
        case "1": {

            $('<div>').attr('id', feID).appendTo($parent).dxTextBox(option);
            break;
        }
        case "2": {
            if (field.DS_DATA.length > 0) {
                option.dataSource = field.DS_DATA;
                option.displayExpr = "DES";
                option.valueExpr = "IDLINE";

                $('<div>').attr('id', feID).appendTo($parent).dxSelectBox(option);
            }
            else {
                $('<div>').attr('id', feID).appendTo($parent).dxTextBox(option);
            }
            break;
        }
        case "3": {
            $('<div>').attr('id', feID).appendTo($parent).dxCheckBox(option);
            break;
        }
        case "4": {
            option.formatString = "yyyy-MM-dd";
            option.pickerType = "calendar";
            option.dateSerializationFormat = "yyyy-MM-dd";
            $('<div>').attr('id', feID).appendTo($parent).dxDateBox(option);
            break;
        }
        case "5": {
            option.height = "100px";
            $('<div>').attr('id', feID).appendTo($parent).dxTextArea(option);
            break;
        }
        case "7": {
            $('<div>').attr('id', feID).appendTo($parent).dxNumberBox(option);
            break;
        }
        case "8": {
            option.dataWindow = true;
            //option.readOnly = true;
            $('<div>').attr('id', feID).appendTo($parent).dxTextBox(option);
            break;
        }
    }
}

function ServerError(errorMessage) {
    DevExpress.ui.notify(errorMessage, "error", 2000);
    if (errorMessage == "NO SESSION") {
        DevExpress.ui.notify("用户登录已失效，请重新登录", "error", 2000);
        var sessionStorage = window.sessionStorage;
        var u = sessionStorage.getItem("username");
        if (u != null) {
            sessionStorage.removeItem("username");
        }
        DMAPP.app.viewCache.clear();
        var view = "Login/0";
        var option = { root: true };
        DMAPP.app.navigate(view, option);
    }
    else {
        DevExpress.ui.notify(errorMessage, "error", 2000);
    }
}

function MainValueChanged(viewModel, e) {
    var val = e.value;
    var loadIndicator = $("#loadIndicator").dxLoadIndicator("instance");
    loadIndicator.option("visible", true);

    var u = sessionStorage.getItem("username");
    var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/FieldValueChanged";
    var postData = {
        userName: u,
        blockID: "BMAINBLOCK",
        fieldName: e.dataField,
        fieldValue: e.value,
        rowIndex: 0
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: postData,
        cache: false,
        success: function (data, textStatus) {
            if (data.DATA != null) {
                var dr = data.DATA[0];
                var form = $("#formMain").dxForm("instance");
                form.option("formData", dr);
                form.repaint();
            }
            loadIndicator.option("visible", false);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            e.value = "";
            loadIndicator.option("visible", false);
            ServerError(xmlHttpRequest.responseText);
        }
    });
}

function GridRowUpdated(viewModel,gridName,e) {
    var loadIndicator = $("#loadIndicator").dxLoadIndicator("instance");
    loadIndicator.option("visible", true);

    var grid = $("#" + gridName).dxDataGrid("instance");
    var row = grid.getRowIndexByKey(e.key);
    var rowData = [];
    rowData.push(e.data);
    var u = sessionStorage.getItem("username");
    var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GridRowChanged";
    var option = grid.option();
    var postData = {
        userName: u,
        blockID: option.block,
        rowIndex: option.currentRow,
        rowData: rowData
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: postData,
        cache: false,
        success: function (data, textStatus) {
            if (data.DATA != null) {
                var dr = data[0]
                var dataSource = option.dataSource;
                dataSource[option.currentRow] = dr;
                grid.option("dataSource", dataSource);
                grid.refresh();
            }
            loadIndicator.option("visible", false);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            loadIndicator.option("visible", false);
            ServerError(xmlHttpRequest.responseText);
        }
    });
}

function GridRowInsert(viewModel, gridName, e) {
    var loadIndicator = $("#loadIndicator").dxLoadIndicator("instance");
    loadIndicator.option("visible", true);
    var grid = $("#" + gridName).dxDataGrid("instance");
    var option = grid.option();
    var u = sessionStorage.getItem("username");
    var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/AddNewRow";
    var postData = {
        blockID: option.block,
        userName: u
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: postData,
        cache: false,
        success: function (data, textStatus) {
            if (data.DATA != null) {
                var dr = data[0]
                var dataSource = option.dataSource;
                dataSource[option.currentRow] = dr;
                grid.option("dataSource", dataSource);
                grid.refresh();
            }
            loadIndicator.option("visible", false);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            viewModel.indicatorVisible(false);
            ServerError(xmlHttpRequest.responseText);
        }
    });
}

function GridRowDelete(viewModel, gridName, e) {
    var loadIndicator = $("#loadIndicator").dxLoadIndicator("instance");
    loadIndicator.option("visible", true);
    var u = sessionStorage.getItem("username");
    var grid = $("#" + gridName).dxDataGrid("instance");
    var option = grid.option();
    var rowIndex = grid.getRowIndexByKey(e.key);
    var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/DeleteRow";
    var postData = {
        userName: u,
        blockID: option.block,
        rowIndex: rowIndex
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: postData,
        cache: false,
        success: function (data, textStatus) {
            loadIndicator.option("visible", false);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            loadIndicator.option("visible", false);
            ServerError(xmlHttpRequest.responseText);
        }
    });
}



function OpenDataWindow(viewModel, name, block) {
    viewModel.keepCache = true;
    var form = $("#formMain").dxForm("instance");
    var editor = form.getEditor(name);

    if (editor.option("readOnly") == true)
    {
        return;
    }

    //var option = form.itemOption(name)
    var p = {
        rowIndex: 0,
        blockID: block,
        fieldName: name,
        fieldDES: "选取数据" //option.label.text
    };

    sessionStorage.setItem("dwParam", JSON.stringify(p));
    viewModel.keepCache = true;
    DMAPP.app.navigate("DataWindow");
}

function OpenGridDataWindow(viewModel, gridname, e) {
    viewModel.keepCache = true;
    var grid = $("#" + gridname).dxDataGrid("instance");

    var p = {
        rowIndex: e.rowIndex,
        blockID: grid.option().block,
        fieldName: e.column.dataField,
        fieldDES: e.column.caption
    };

    sessionStorage.setItem("dwParam", JSON.stringify(p));
    viewModel.keepCache = true;
    DMAPP.app.navigate("DataWindow");
}

function UpdateDataWindow(viewModel) {
    var dwData = [];
    dwData.push(JSON.parse(sessionStorage.getItem("dwData")));

    var u = sessionStorage.getItem("username");
    var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/SetDataWindow";

    var param = JSON.parse(sessionStorage.getItem("dwParam"));



    var postData = {
        blockID: param.blockID,
        fieldName: param.fieldName,
        data: dwData,
        userName: u,
        rowIndex: 0
    };

    $.ajax({
        type: 'POST',
        url: url,
        data: postData,
        cache: false,
        success: function (data, textStatus) {
            viewModel.indicatorVisible(false);
            var dr = data[0]
            var form = $("#formMain").dxForm("instance");
            try
            {
                form.option("formData", dr);
            }
            catch(e){}
            //form.repaint();
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            ServerError(xmlHttpRequest.responseText);
            viewModel.indicatorVisible(false);
        }
    });

}

function UpdateGridDataWindow(viewModel,gridname) {
    var dwData = [];
    dwData.push(JSON.parse(sessionStorage.getItem("dwData")));
    var grid = $("#" + gridname).dxDataGrid("instance");
    var u = sessionStorage.getItem("username");
    var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/SetDataWindow";
    var option = grid.option();
    var param = JSON.parse(sessionStorage.getItem("dwParam"));

    var postData = {
        blockID: param.blockID,
        fieldName: param.fieldName,
        data: dwData,
        userName: u,
        rowIndex: option.currentRow
    };

    $.ajax({
        type: 'POST',
        url: url,
        data: postData,
        cache: false,
        success: function (data, textStatus) {
            viewModel.indicatorVisible(false);
            var dr = data[0]
            var dataSource = option.dataSource;
            dataSource[option.currentRow] = dr;
            grid.option("dataSource", dataSource);
            grid.refresh();
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            ServerError(xmlHttpRequest.responseText);
            viewModel.indicatorVisible(false);
        }
    });

}

function SetGridRowIndex(gridname, rowIndex)
{
    var grid = $("#" + gridname).dxDataGrid("instance");
    grid.option("currentRow", rowIndex);
}

function ButtonClick(viewModel, BLOCKID, BTNID, comment, params) {
    viewModel.indicatorVisible(true);
    var u = sessionStorage.getItem("username");
    var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/ButtonClick2?UserName=" + u + "&BLOCKID=" + BLOCKID + "&BTNID=" + BTNID + "&COMMENT=" + comment;
    url = encodeURI(url);
    $.ajax({
        type: 'GET',
        url: url,
        async:false,
        cache: false,
        success: function (data, textStatus) {
            if (data.Close == "1") {
                var cache = DMAPP.app.viewCache;
                cache.removeView(viewModel.viewKey);
                (new DevExpress.framework.dxCommand({ onExecute: "#_back" })).execute();
                return;
            }

            if (data.Message != "" && data.Message != null) {
                ButtonClick(viewModel, "", "refresh", "", "");
                DevExpress.ui.notify(data.Message, "success", 2000);
            }
            viewModel.indicatorVisible(false);

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            viewModel.indicatorVisible(false);
            ServerError(xmlHttpRequest.responseText);
        }
    });
}

function GetDateTimeString() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    if (month <= 9) {
        month = "0" + month;
    }
    if (strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hour <= 9) {
        hour = "0" + hour;
    }
    if (min <= 9) {
        min = "0" + min;
    }

    if (sec <= 9) {
        sec = "0" + sec;
    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + "T" + hour + seperator2 + min
            + seperator2 + sec;
    return currentdate;
}

function GetDateString() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}