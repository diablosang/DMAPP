DMAPP.EMSChart2 = function (params) {
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
                { name: "尺寸", type: "line", valueField: "SIZE" },
                { name: "目标尺寸", type: "line", valueField: "SIZE_S" },
                {
                    name: "上料", type: "scatter", valueField: "T11", point: {
                        symbol: "triangleUp"
                    }
                },
                {
                    name: "下料", type: "scatter", valueField: "T12", point: {
                        symbol: "triangleDown"
                    }
                },
                {name: "加料", type: "scatter", valueField: "T13"},
            ],
            argumentAxis: {
                argumentType: "datetime",
                label: {
                    format: "MM-dd HH:mm"
                }
            },
            legend: {
                verticalAlignment: "top",
                horizontalAlignment: "center",
                itemTextPosition: "bottom"
            },
            tooltip: {
                enabled: true,
                argumentFormat:"MM-dd HH:mm",
                customizeTooltip: function (e) {
                    if (e.seriesName == "上料" || e.seriesName == "加料" || e.seriesName == "下料") {
                        return { text: e.seriesName + "<br/>" + e.argumentText }
                    }
                    else {
                        return { text: e.value }
                    }
                }
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
        var ckSIZE = $("#ckSIZE").dxCheckBox("instance");
        var ckSXL = $("#ckSXL").dxCheckBox("instance");

        if (ckSIZE.option("value") == true) {
            var ser = { name: "尺寸", type: "line", valueField: "SIZE" };
            var ser2 = { name: "目标尺寸", type: "line", valueField: "SIZE_S" };
            series.push(ser);
            series.push(ser2);
        }

        if (ckSXL.option("value") == true) {
            var ser = {
                name: "上料", type: "scatter", valueField: "T11", point: {
                    symbol: "triangleUp"
                }
            };
            var ser2 = {
                name: "下料", type: "scatter", valueField: "T12", point: {
                    symbol: "triangleDown"
                }
            };
            var ser3 ={name: "加料", type: "scatter", valueField: "T13"};
            series.push(ser);
            series.push(ser2);
            series.push(ser3);
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
            methodName: "EMS.EMS_CHART.GetPARData2",
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