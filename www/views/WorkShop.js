DMAPP.WorkShop = function (params) {
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
        itemData: new DevExpress.data.DataSource({
            store: [],
            group: function (dataItem) {
                return dataItem.CODE_WS;
            }
        }),
        listOptions: {
            dataSource: this.itemData,
            height: "100%",
            grouped: true,
            collapsibleGroups: true,
            onItemClick: function (e) {
                var data = e.itemData;
                var CODE_LINE = data.CODE_LINE;
                var DESC_LINE = data.DESC_LINE;
                OpenDoc(CODE_LINE, DESC_LINE);
            }
        },
        onScrollViewPullingDown: function (e) {
            BindData(this);
            e.component.release();
        },
    };
    return viewModel;

    function BindData(viewModel) {
        try {
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            var postData = {
                userName: u,
                sql: "select * from MFG_B_LINE"
            };

            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetData";
            $.ajax({
                type: 'POST',
                url: url,
                data:postData,
                cache: false,
                success: function (data, textStatus) {
                    viewModel.itemData.store().clear();

                    for (var i = 0; i < data.length; i++) {
                        viewModel.itemData.store().insert(data[i]);
                    }
                    viewModel.itemData.load();

                    $("#listDash").dxList({
                        dataSource: viewModel.itemData
                    });
                    viewModel.indicatorVisible(false);
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

    function OpenDoc(CODE_LINE,DESC_LINE) {
        var view = "DeviceTable?CODE_LINE=" + CODE_LINE + "&DESC_LINE=" + DESC_LINE;
        DMAPP.app.navigate(view);
    }

    function SetLanguage() {
        if (DeviceLang() == "CHS") {
            viewModel.title("产线列表");
        }
        else {
            viewModel.title("Product Line");
        }
    }
};