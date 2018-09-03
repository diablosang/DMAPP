DMAPP.EMSChart = function (params) {
    "use strict";

    var viewModel = {
        viewShown: function (e) {
            this.viewKey = e.viewInfo.key;
            InitData();
        },
        viewHidden: function (e) {
            if (viewModel.keepCache == false) {
                var cache = DMAPP.app.viewCache;
                cache.removeView(e.viewInfo.key);
            }
        },
        chartOption: {
            commonSeriesSettings: {
                argumentField: "PAR_TIME",
                type: "line"
            },
            series: [
                { name: "压力", type: "line", valueField: "YL" },
                { name: "料盘转速", type: "line", valueField: "LP" },
                { name: "主轴转速", type: "line", valueField: "ZZ" },
            ],
            argumentAxis: {
                argumentType: "datetime",
                label: {
                    format:"MM-dd HH:mm"
                }
            },
            legend: {
                verticalAlignment: "top",
                horizontalAlignment: "center",
                itemTextPosition: "bottom"
            },
            tooltip: {
                enabled: true
            }
        },
        buttonLoadClick: function (e) {
            BindData();
        },
        checkChanged: function (e) {
            SetChartSeries();
        }
    };

    function SetChartSeries() {
        var series = [];
        var ckYL = $("#ckYL").dxCheckBox("instance");
        var ckZZ = $("#ckZZ").dxCheckBox("instance");
        var ckLP = $("#ckLP").dxCheckBox("instance");

        if (ckYL.option("value") == true){
            var ser = { name: "压力", type: "line", valueField: "YL" };
            series.push(ser);
        }

        if (ckZZ.option("value") == true) {
            var ser = { name: "主轴", type: "line", valueField: "ZZ" };
            series.push(ser);
        }

        if (ckLP.option("value") == true) {
            var ser = { name: "料盘", type: "line", valueField: "LP" };
            series.push(ser);
        }

        var charPar = $("#chartPar").dxChart("instance");
        charPar.option("series", series);
    }

    function InitData() {
        var now = new Date();
        var nowSTR = now.Format("yyyy-MM-ddTHH:mm:ss");
        var nowM8 = now;
        nowM8.setTime(nowM8.getTime() - 60 * 60 * 1000 * 8);
        var nowSTRM8 = nowM8.Format("yyyy-MM-ddTHH:mm:ss");

        var dateFrom = $("#dateFrom").dxDateBox("instance");
        var dateTo = $("#dateTo").dxDateBox("instance");
        dateFrom.option("value", nowSTRM8);
        dateTo.option("value", nowSTR);
        BindData();
    }

    function BindData() {
        var u = sessionStorage.getItem("username");
        var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/CallMethod";
        var dateFrom = $("#dateFrom").dxDateBox("instance");
        var dateTo = $("#dateTo").dxDateBox("instance");

        var dFrom = dateFrom.option("value");
        var dTo = dateTo.option("value");

        var postData = {
            userName: u,
            methodName: "EMS.EMS_CHART.GetPARData",
            param: params.CODE_EQP + ";" + dFrom + ";" + dTo
        }

        $.ajax({
            type: 'POST',
            data: postData,
            url: url,
            async: false,
            cache: false,
            success: function (data, textStatus) {
                var chartData = [];
                for (var i = 0; i < data.length; i++) {
                    chartData.push(data[i]);
                }

                var charPar = $("#chartPar").dxChart("instance");
                charPar.option("dataSource", chartData);

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