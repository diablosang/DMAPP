DMAPP.EQCMenu = function (params) {
    "use strict";

    var viewModel = {
        tileBarOption: {
            items: (function () {
                if (DeviceLang() == "CHS") {
                    return [
                        { name: 'OK', text: '合格' },
                        { name: 'CG', text: '改制' },
                        { name: 'RT', text: '返工' },
                        { name: 'SC', text: '报废' }
                    ];
                } else {
                    return [
                        { name: 'OK', text: 'OK' },
                        { name: 'CG', text: 'Change' },
                        { name: 'RT', text: 'Return' },
                        { name: 'SC', text: 'Scrap' }
                    ];
                }
            })(),
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
                var view = "EQCEdit?TYPE=" + e.itemData.name;
                DMAPP.app.navigate(view);
            }
        }
    };

    return viewModel;
};