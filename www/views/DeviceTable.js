DMAPP.DeviceTable = function (params) {
    "use strict";

    var viewModel = {
        title: ko.observable(""),
        viewShown: function () {
            this.title(params.DESC_LINE);

            BindData(params.CODE_LINE);
        },
        onLogoffClick: function () {
            Logoff();
        }
    };

    function BindData(CODE_LINE)
    {
        try {
            var sessionStorage = window.sessionStorage;
            var u = sessionStorage.getItem("username");
            var postData = {
                userName: u,
                sql: "select S.COLOR,V.* from V_EMS_T_EQP V left outer join EMS_B_EQS S on V.STATUS_OP=S.STATUS_OP where CODE_LINE='" + CODE_LINE + "' and isnull(POS_X,0)>0 order by POS_X,POS_Y"
            };

            var url = $("#WebApiServerURL")[0].value + "/Api/Asapment/GetData";
            $.ajax({
                type: 'POST',
                url: url,
                data: postData,
                cache: false,
                success: function (data, textStatus) {
                    var r = 0;
                    var c = 0;
                    var maxR = 0;
                    var maxC = 0;
                    var table = $("#tbDevice");
                    table.empty();

                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        if (d.POS_X > maxR){
                            maxR = d.POS_X;
                        }

                        if (d.POS_Y > maxC) {
                            maxC = d.POS_Y;
                        }
                    }

                    for (var r = 1; r <=maxR; r++)
                    {
                        $('<tr>').attr('id', 'tr_' + r).attr('height', '75px').appendTo(table);
                        var tr = $("#tr_" + r);
                        for (var c = 1; c <=maxC; c++)
                        {
                            //$('<td>').attr('id', 'td_' + r + "_" + c).css('border', '1px solid').css('width', '100px').css('padding','5px 5px 5px 5px').appendTo(tr);
                            $('<td>').attr('id', 'td_' + r + "_" + c).appendTo(tr);
                        }
                    }

                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        var td = $("#td_"+d.POS_X+"_" + d.POS_Y);
                        td.attr('CODE_EQP', d.CODE_EQP);
                        td.attr('align', 'center');
                        td.attr('valign', 'middle');
                        td.attr('onclick', "DeivceClick('" + d.CODE_EQP + "');");
                        var color = "#F5F5F5";
                        if (d.COLOR != null && d.COLOR != "") {
                            color = "#" + d.COLOR;
                        }
                        td.css("background-color", color);
                        //if (d.STATUS_OP == "0" || d.STATUS_OP==null)
                        //{
                        //    td.css("background-color", "rgb(51, 232, 37)");
                        //}
                        //else if (d.STATUS_OP == "1") {
                        //    td.css("background-color", "yellow");
                        //}
                        //else if (d.STATUS_OP == "2") {
                        //    td.css("background-color", "rgb(238, 121, 89)");
                        //}
                        //else if (d.STATUS_OP == "3") {
                        //    td.css("background-color", "rgb(238, 121, 89)");
                        //}
                        //else {
                        //    td.css("background-color", "rgb(245, 245, 245)");
                        //}

                        td.css('border-radius', '7px');
                        td.css('box-shadow', '3px 3px 3px #888888');

                        $('<div>').html(d.CODE_EQP).appendTo(td);
                        $('<div>').html(d.DESC_DISP1).css("font-size", "small").appendTo(td);
                        $('<div>').html(d.DESC_DISP2).appendTo(td);
                    }      
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    viewModel.indicatorVisible(false);
                    ServerError(xmlHttpRequest.responseText);
                }
            });

            postData = {
                userName: u,
                sql: "select S.COLOR,L.DES1,L.DES2 from EMS_B_EQS S inner join SYS_LISTDETAIL L on L.IDNUM='ST_EMS_B_EQPOP'  and L.IDLINE=S.STATUS_OP "
            };
            $.ajax({
                type: 'POST',
                url: url,
                data: postData,
                cache: false,
                success: function (data, textStatus) {
                    var table = $("#tbLegend");
                    table.empty();
                    $('<tr>').attr('id', 'trLegend').appendTo(table);
                    var tr = $("#trLegend");                   
                    for (var i = 0; i < data.length; i++) {
                        var desc = DeviceLang() == "CHS" ? data[i].DES1 : data[i].DES2;
                        var color = "#" + data[i].COLOR;
                        var html = "<td align='center' style='width:100px;background-color:" + color + "'>" + desc + "</td>";
                        $(html).appendTo(tr);
                    }
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

    return viewModel;
};

function DeivceClick(e) {
    //var CODE_EQP = e.srcElement.attributes["CODE_EQP"].value;
    var view = "DeviceInfo?CODE_EQP=" + e;
    DMAPP.app.navigate(view);
}