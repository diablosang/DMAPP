﻿var DeviceLang = function () {
    if (navigator.language.indexOf("CN") >= 0 || navigator.language.indexOf("zh") >= 0) {
        return "CHS";
    }
    else {
        return "ENG";
    }
}

var DESField = function () {
    if (DeviceLang() == "CHS") {
        return "DES1";
    }
    else {
        return "DES2";
    }
}

var SysMsg = {}

var chsMsg = {
    saveSuccess: "保存成功",
    saveFailed: "保存失败",
    info: "提示",
    newVer: "当前应用存在新版本，是否要立刻下载？",
    yes: "是",
    no: "否",
    scanFailed: "扫描失败：",
    upperFolder: "上级目录",
    rootFolder: "根目录",
    delSuccess: "删除成功",
    subSuccess: "提交成功",
    noDetail: "该单据未包含明细信息",
    confirmREP: "您确定要报修吗？",
    confirmREPFinish: "您确定要报告设备修复",
    confirmREPResult: "请选择设备维修结论",
    repFin: "完成",
    repReturn: "返修",
    confirmMAT1: "您确定要添加辅料",
    confirmMAT2: "您确定要更换辅料",
    goback: "返回上一层",
    logoff: "注销",
    inputEQP: "请输入设备代码",
    submit: "提交",
    nodata: "无法读取数据",
    yl: "压力",
    zz: "主轴转速",
    lp: "料盘转速",
    pzj: "批直径变动量",
    round:"圆度",
    load: "加载数据",
    cc: "尺寸",
    sxl: "上下料",
    sl: "上料",
    xl: "下料",
    fltj: "辅料添加",
    flgh: "辅料更换",
    mbcc: "目标尺寸",
    cpjy: "产品检验",
    cpjyjl: "产品检验结论",
    fljy: "辅料检验",
    fljyjl: "辅料检验结论",
    yd: "圆度",
    jl: "结论",
    hg: "合格",
    bhg: "不合格",
    yj: "意见",
    cslx: "参数类型",
    woid: "工单号",
    gzwlh: "改制物料号",
    codeop: "工序",
    coderop: "改制工序",
    jyjg: "检验结果",
    remark: "备注",
    codeloc: "库位",
    qty: "数量",
    cancel: "取消",
    nddj: "浓度点检",
    scz: "实测值",
    min: "下限值",
    max: "上限值",
    fuzzysearch: "模糊查找",
    itemdoc: "零件文档",
    selectFields: "选择字段",
    ws_1: "质检",
    ws_2: "转移",
    ws_3: "文档",
    ws_4: "报表",
    ws_5: "称重",
    codert: "改制工艺",
    other: "其他",
    devicenote: "设备便签",
    comment: "内容",
    note_creusr: "发布人",
    date: "日期",
    note_reqired: "必须填写内容",
    sid: "序号",
    amd: "设备点检",
    amd_dateplan: "计划点检日期",
    amd_codeitem: "点检项",
    amd_descitem: "点检项说明",
    amd_type: "类别",
    amd_config: "属性",
    amd_method: "控制方法",
    amd_methoddesc: "控制方法说明",
    amd_f_image: "是否上传图片",
    amd_value: "点检结果",
    useInput: "应用输入值",
    inputValueHolder: "输入自定义值"
    
}
var engMsg = {
    saveSuccess: "Save success",
    saveFailed: "Save failed",
    info: "Info",
    newVer: "These exists new version of this APP, do you want to download it now?",
    yes: "Yes",
    no: "No",
    scanFailed: "Scan failed: ",
    upperFolder: "Upper Folder",
    rootFolder: "Root Folder",
    delSuccess: "Delete success",
    subSuccess: "Submit success",
    noDetail: "There does not exists detail infomation.",
    confirmREP: "Are you sure you want to submit a repair application？",
    confirmREPFinish: "Did you finished repair this equipment？",
    confirmREPResult: "Please choose the conclusion",
    repFin: "Finish",
    repReturn: "Return",
    confirmMAT1: "Are you sure you want to add cut media?",
    confirmMAT2: "Are you sure you want to change coolant?",
    goback: "Go back",
    logoff: "Logoff",
    inputEQP: "Input equipment code",
    submit: "Submit",
    nodata: "Failed to get data.",
    yl: "Pressure",
    zz: "RPM Spindle",
    lp: "RPM Turntable",
    pzj: "Vdwl",
    round: "Round",
    load: "Load Data",
    cc: "Size",
    sxl: "Materials",
    sl: "Loading",
    xl: "Unloading",
    fltj: "Add Cut Media",
    flgh: "Change Coolant",
    mbcc: "Standard Size",
    cpjy: "Product QC",
    cpjyjl: "Product QC Conclution",
    fljy: "Material QC",
    fljyjl: "Material QC Conclution",
    yd: "Roundness",
    jl: "Conclution",
    hg: "Pass",
    bhg: "Failed",
    yj: "Comment",
    cslx: "Type",
    woid: "Work Order",
    gzwlh: "New Item Code",
    codeop: "OP",
    coderop: "ROP",
    jyjg: "Type",
    remark: "Remark",
    codeloc: "Location",
    qty: "Qty.",
    cancel: "Cancel",
    nddj: "Coolant Concentration",
    scz: "Actual Value",
    min: "Min Value",
    max: "Max Value",
    fuzzysearch: "Fuzzy Search",
    itemdoc: "Item Documents",
    selectFields: "Select Fields",
    ws_1: "QC",
    ws_2: "Transfer",
    ws_3: "Documents",
    ws_4: "Report",
    ws_5: "Weighing",
    codert: "New Routing",
    other: "Other",
    devicenote: "Device Note",
    comment: "comment",
    note_creusr: "Publisher",
    date: "Date",
    note_reqired: "Comment Requied",
    sid:"sid",
    amd: "Equipment AM",
    amd_dateplan: "Date Plan",
    amd_codeitem: "Item Code",
    amd_descitem: "Item Description",
    amd_type: "Item Type",
    amd_config: "Config",
    amd_method: "Method",
    amd_methoddesc:"Method Description",
    amd_f_image: "Need Photo",
    amd_value: "Value",
    useInput: "Use Input Value",
    inputValueHolder:"Input Customized Value"
}


! function (root, factory) {
    if ("function" === typeof define && define.amd) {
        define(function (require) {
            factory(require("devextreme/localization"))
        })
    } else {
        factory(DevExpress.localization)
    }
}(this, function (localization) {
    if (DeviceLang() == "CHS") {
        localization.loadMessages({
            en: {
                Yes: "是",
                No: "否",
                Cancel: "取消",
                Clear: "清除",
                Done: "完成",
                Loading: "加载...",
                Select: "选择...",
                Search: "查找",
                Back: "退回",
                OK: "确定",
                "dxCollectionWidget-noDataText": "没有可显示的数据",
                "validation-required": "必填",
                "validation-required-formatted": "{0} 为必填",
                "validation-numeric": "值必须是数字",
                "validation-numeric-formatted": "{0} 的值必须是数字",
                "validation-range": "值超出允许范围",
                "validation-range-formatted": "{0} 的值超出允许范围",
                "validation-stringLength": "值的长度不正确",
                "validation-stringLength-formatted": "{0} 值的长度不正确",
                "validation-custom": "无效的值",
                "validation-custom-formatted": "{0} 是无效的值",
                "validation-compare": "值不匹配",
                "validation-compare-formatted": "{0} 的值不匹配",
                "validation-pattern": "值与规则不匹配",
                "validation-pattern-formatted": "{0} 的值与规则不匹配",
                "validation-email": "Email格式不正确",
                "validation-email-formatted": "{0}格式不正确",
                "validation-mask": "值不正确",
                "dxLookup-searchPlaceholder": "必须输入最小长度: {0}",
                "dxList-pullingDownText": "下拉刷新...",
                "dxList-pulledDownText": "释放刷新...",
                "dxList-refreshingText": "刷新...",
                "dxList-pageLoadingText": "加载...",
                "dxList-nextButtonText": "更多",
                "dxList-selectAll": "全选",
                "dxListEditDecorator-delete": "删除",
                "dxListEditDecorator-more": "更多",
                "dxScrollView-pullingDownText": "下拉刷新...",
                "dxScrollView-pulledDownText": "释放刷新...",
                "dxScrollView-refreshingText": "刷新...",
                "dxScrollView-reachBottomText": "加载...",
                "dxDateBox-simulatedDataPickerTitleTime": "选择时间",
                "dxDateBox-simulatedDataPickerTitleDate": "选择日期",
                "dxDateBox-simulatedDataPickerTitleDateTime": "选择日期与时间",
                "dxDateBox-validation-datetime": "值必须是日期或时间",
                "dxFileUploader-selectFile": "选择文件",
                "dxFileUploader-dropFile": "或拖放文件在这里",
                "dxFileUploader-bytes": "bytes",
                "dxFileUploader-kb": "kb",
                "dxFileUploader-Mb": "Mb",
                "dxFileUploader-Gb": "Gb",
                "dxFileUploader-upload": "上传",
                "dxFileUploader-uploaded": "已上传",
                "dxFileUploader-readyToUpload": "准备上传",
                "dxFileUploader-uploadFailedMessage": "上传失败",
                "dxRangeSlider-ariaFrom": "从",
                "dxRangeSlider-ariaTill": "至",
                "dxSwitch-onText": "是",
                "dxSwitch-offText": "否",
                "dxForm-optionalMark": "可选的",
                "dxForm-requiredMessage": "{0} 为必填项",
                "dxNumberBox-invalidValueMessage": "值必须是数字",
                "dxDataGrid-columnChooserTitle": "列选择器",
                "dxDataGrid-columnChooserEmptyText": "拖放字段至此隐藏",
                "dxDataGrid-groupContinuesMessage": "延续到下一页",
                "dxDataGrid-groupContinuedMessage": "延续自上一页",
                "dxDataGrid-groupHeaderText": "根据此列分组",
                "dxDataGrid-ungroupHeaderText": "取消分组",
                "dxDataGrid-ungroupAllText": "取消所有分组",
                "dxDataGrid-editingEditRow": "编辑",
                "dxDataGrid-editingSaveRowChanges": "保存",
                "dxDataGrid-editingCancelRowChanges": "取消",
                "dxDataGrid-editingDeleteRow": "删除",
                "dxDataGrid-editingUndeleteRow": "反删除",
                "dxDataGrid-editingConfirmDeleteMessage": "您确定要删除这条数据？",
                "dxDataGrid-validationCancelChanges": "取消变更",
                "dxDataGrid-groupPanelEmptyText": "拖放字段标题至此以分组",
                "dxDataGrid-noDataText": "没有数据",
                "dxDataGrid-searchPanelPlaceholder": "查找...",
                "dxDataGrid-filterRowShowAllText": "(全部)",
                "dxDataGrid-filterRowResetOperationText": "重置",
                "dxDataGrid-filterRowOperationEquals": "等于",
                "dxDataGrid-filterRowOperationNotEquals": "不等于",
                "dxDataGrid-filterRowOperationLess": "小于",
                "dxDataGrid-filterRowOperationLessOrEquals": "小于等于",
                "dxDataGrid-filterRowOperationGreater": "大于",
                "dxDataGrid-filterRowOperationGreaterOrEquals": "大于等于",
                "dxDataGrid-filterRowOperationStartsWith": "起始于",
                "dxDataGrid-filterRowOperationContains": "包含",
                "dxDataGrid-filterRowOperationNotContains": "不包含",
                "dxDataGrid-filterRowOperationEndsWith": "结束于",
                "dxDataGrid-filterRowOperationBetween": "介于",
                "dxDataGrid-filterRowOperationBetweenStartText": "开始",
                "dxDataGrid-filterRowOperationBetweenEndText": "结束",
                "dxDataGrid-applyFilterText": "应用筛选",
                "dxDataGrid-trueText": "是",
                "dxDataGrid-falseText": "否",
                "dxDataGrid-sortingAscendingText": "顺序排序",
                "dxDataGrid-sortingDescendingText": "倒序排序",
                "dxDataGrid-sortingClearText": "清除排序",
                "dxDataGrid-editingSaveAllChanges": "保存更改",
                "dxDataGrid-editingCancelAllChanges": "放弃更改",
                "dxDataGrid-editingAddRow": "新增行",
                "dxDataGrid-summaryMin": "最小: {0}",
                "dxDataGrid-summaryMinOtherColumn": "{1}的最小值{0}",
                "dxDataGrid-summaryMax": "最大: {0}",
                "dxDataGrid-summaryMaxOtherColumn": "{1}的最大值{0}",
                "dxDataGrid-summaryAvg": "平均: {0}",
                "dxDataGrid-summaryAvgOtherColumn": "{1}的平均值{0}",
                "dxDataGrid-summarySum": "合计: {0}",
                "dxDataGrid-summarySumOtherColumn": "{1}的平均值{0}",
                "dxDataGrid-summaryCount": "计数: {0}",
                "dxDataGrid-columnFixingFix": "固定",
                "dxDataGrid-columnFixingUnfix": "不固定",
                "dxDataGrid-columnFixingLeftPosition": "左侧",
                "dxDataGrid-columnFixingRightPosition": "右侧",
                "dxDataGrid-exportTo": "导出",
                "dxDataGrid-exportToExcel": "导出到Excel",
                "dxDataGrid-excelFormat": "Excel",
                "dxDataGrid-selectedRows": "选中的行",
                "dxDataGrid-exportSelectedRows": "导出选中的行",
                "dxDataGrid-exportAll": "导出所有行",
                "dxDataGrid-headerFilterEmptyValue": "(空)",
                "dxDataGrid-headerFilterOK": "是",
                "dxDataGrid-headerFilterCancel": "取消",
                "dxDataGrid-ariaColumn": "列",
                "dxDataGrid-ariaValue": "值",
                "dxDataGrid-ariaFilterCell": "筛选单元格",
                "dxDataGrid-ariaCollapse": "折叠",
                "dxDataGrid-ariaExpand": "展开",
                "dxDataGrid-ariaDataGrid": "数据网格",
                "dxDataGrid-ariaSearchInGrid": "搜索数据网格",
                "dxDataGrid-ariaSelectAll": "全选",
                "dxDataGrid-ariaSelectRow": "选择行",
                "dxPager-infoText": "第{0}/{1}页 ({2}条记录)",
                "dxPager-pagesCountText": "of",
                "dxPivotGrid-grandTotal": "全局合计",
                "dxPivotGrid-total": "{0} 合计",
                "dxPivotGrid-fieldChooserTitle": "字段选择器",
                "dxPivotGrid-showFieldChooser": "显示字段选择器",
                "dxPivotGrid-expandAll": "展开全部",
                "dxPivotGrid-collapseAll": "折叠全部",
                "dxPivotGrid-sortColumnBySummary": '根据此列的"{0}"排序',
                "dxPivotGrid-sortRowBySummary": '根据此行的"{0}"排序',
                "dxPivotGrid-removeAllSorting": "取消所有排序",
                "dxPivotGrid-rowFields": "行字段",
                "dxPivotGrid-columnFields": "列字段",
                "dxPivotGrid-dataFields": "数值字段",
                "dxPivotGrid-filterFields": "筛选字段",
                "dxPivotGrid-allFields": "所有字段",
                "dxPivotGrid-columnFieldArea": "拖放列字段至此",
                "dxPivotGrid-dataFieldArea": "拖放数值字段至此",
                "dxPivotGrid-rowFieldArea": "拖放行字段至此",
                "dxPivotGrid-filterFieldArea": "拖放筛选字段至此",
                "dxScheduler-editorLabelTitle": "主题",
                "dxScheduler-editorLabelStartDate": "起始日期",
                "dxScheduler-editorLabelEndDate": "截止日期",
                "dxScheduler-editorLabelDescription": "描述",
                "dxScheduler-editorLabelRecurrence": "循环",
                "dxScheduler-openAppointment": "打开预约",
                "dxScheduler-recurrenceNever": "从不",
                "dxScheduler-recurrenceDaily": "每日",
                "dxScheduler-recurrenceWeekly": "每周",
                "dxScheduler-recurrenceMonthly": "每月",
                "dxScheduler-recurrenceYearly": "每年",
                "dxScheduler-recurrenceEvery": "每个",
                "dxScheduler-recurrenceEnd": "结束循环",
                "dxScheduler-recurrenceAfter": "之后",
                "dxScheduler-recurrenceOn": "On",
                "dxScheduler-recurrenceRepeatDaily": "日",
                "dxScheduler-recurrenceRepeatWeekly": "周",
                "dxScheduler-recurrenceRepeatMonthly": "月",
                "dxScheduler-recurrenceRepeatYearly": "年",
                "dxScheduler-switcherDay": "日",
                "dxScheduler-switcherWeek": "周",
                "dxScheduler-switcherWorkWeek": "工作周",
                "dxScheduler-switcherMonth": "月",
                "dxScheduler-switcherAgenda": "日程",
                "dxScheduler-switcherTimelineDay": "时间线日",
                "dxScheduler-switcherTimelineWeek": "时间线周",
                "dxScheduler-switcherTimelineWorkWeek": "时间线工作周",
                "dxScheduler-switcherTimelineMonth": "时间线月",
                "dxScheduler-recurrenceRepeatOnDate": "根据日期",
                "dxScheduler-recurrenceRepeatCount": "事件",
                "dxScheduler-allDay": "每天",
                "dxScheduler-confirmRecurrenceEditMessage": "您是要仅编辑此项预约还是整个系列?",
                "dxScheduler-confirmRecurrenceDeleteMessage": "您是要仅删除此项预约还是整个系列?",
                "dxScheduler-confirmRecurrenceEditSeries": "编辑系列",
                "dxScheduler-confirmRecurrenceDeleteSeries": "删除系列",
                "dxScheduler-confirmRecurrenceEditOccurrence": "编辑预约",
                "dxScheduler-confirmRecurrenceDeleteOccurrence": "删除预约",
                "dxScheduler-noTimezoneTitle": "没有时区",
                "dxCalendar-todayButtonText": "今天",
                "dxCalendar-ariaWidgetName": "日历",
                "dxColorView-ariaRed": "红",
                "dxColorView-ariaGreen": "绿",
                "dxColorView-ariaBlue": "蓝",
                "dxColorView-ariaAlpha": "透明度",
                "dxColorView-ariaHex": "颜色代码",
                "vizExport-printingButtonText": "打印",
                "vizExport-titleMenuText": "导出中/打印中",
                "vizExport-exportButtonText": "{0}文件"
            }
        });
    }
    else {
        localization.loadMessages({
            en: {
                Yes: "Yes",
                No: "No",
                Cancel: "Cancel",
                Clear: "Clear",
                Done: "Done",
                Loading: "Loading...",
                Select: "Select...",
                Search: "Search",
                Back: "Back",
                OK: "OK",
                "dxCollectionWidget-noDataText": "",
                "validation-required": "Required",
                "validation-required-formatted": "{0} is required",
                "validation-numeric": "Value must be a number",
                "validation-numeric-formatted": "{0} must be a number",
                "validation-range": "Value is out of range",
                "validation-range-formatted": "{0} is out of range",
                "validation-stringLength": "The length of the value is not correct",
                "validation-stringLength-formatted": "The length of {0} is not correct",
                "validation-custom": "Value is invalid",
                "validation-custom-formatted": "{0} is invalid",
                "validation-compare": "Values do not match",
                "validation-compare-formatted": "{0} does not match",
                "validation-pattern": "Value does not match pattern",
                "validation-pattern-formatted": "{0} does not match pattern",
                "validation-email": "Email is invalid",
                "validation-email-formatted": "{0} is invalid",
                "validation-mask": "Value is invalid",
                "dxLookup-searchPlaceholder": "Minimum character number: {0}",
                "dxList-pullingDownText": "Pull down to refresh...",
                "dxList-pulledDownText": "Release to refresh...",
                "dxList-refreshingText": "Refreshing...",
                "dxList-pageLoadingText": "Loading...",
                "dxList-nextButtonText": "More",
                "dxList-selectAll": "Select All",
                "dxListEditDecorator-delete": "Delete",
                "dxListEditDecorator-more": "More",
                "dxScrollView-pullingDownText": "Pull down to refresh...",
                "dxScrollView-pulledDownText": "Release to refresh...",
                "dxScrollView-refreshingText": "Refreshing...",
                "dxScrollView-reachBottomText": "Loading...",
                "dxDateBox-simulatedDataPickerTitleTime": "Select time",
                "dxDateBox-simulatedDataPickerTitleDate": "Select date",
                "dxDateBox-simulatedDataPickerTitleDateTime": "Select date and time",
                "dxDateBox-validation-datetime": "Value must be a date or time",
                "dxFileUploader-selectFile": "Select file",
                "dxFileUploader-dropFile": "or Drop file here",
                "dxFileUploader-bytes": "bytes",
                "dxFileUploader-kb": "kb",
                "dxFileUploader-Mb": "Mb",
                "dxFileUploader-Gb": "Gb",
                "dxFileUploader-upload": "Upload",
                "dxFileUploader-uploaded": "Uploaded",
                "dxFileUploader-readyToUpload": "Ready to upload",
                "dxFileUploader-uploadFailedMessage": "Upload failed",
                "dxRangeSlider-ariaFrom": "From",
                "dxRangeSlider-ariaTill": "Till",
                "dxSwitch-onText": "ON",
                "dxSwitch-offText": "OFF",
                "dxForm-optionalMark": "optional",
                "dxForm-requiredMessage": "{0} is required",
                "dxNumberBox-invalidValueMessage": "Value must be a number",
                "dxDataGrid-columnChooserTitle": "Column Chooser",
                "dxDataGrid-columnChooserEmptyText": "Drag a column here to hide it",
                "dxDataGrid-groupContinuesMessage": "Continues on the next page",
                "dxDataGrid-groupContinuedMessage": "Continued from the previous page",
                "dxDataGrid-groupHeaderText": "Group by This Column",
                "dxDataGrid-ungroupHeaderText": "Ungroup",
                "dxDataGrid-ungroupAllText": "Ungroup All",
                "dxDataGrid-editingEditRow": "Edit",
                "dxDataGrid-editingSaveRowChanges": "Save",
                "dxDataGrid-editingCancelRowChanges": "Cancel",
                "dxDataGrid-editingDeleteRow": "Delete",
                "dxDataGrid-editingUndeleteRow": "Undelete",
                "dxDataGrid-editingConfirmDeleteMessage": "Are you sure you want to delete this record?",
                "dxDataGrid-validationCancelChanges": "Cancel changes",
                "dxDataGrid-groupPanelEmptyText": "Drag a column header here to group by that column",
                "dxDataGrid-noDataText": "No data",
                "dxDataGrid-searchPanelPlaceholder": "Search...",
                "dxDataGrid-filterRowShowAllText": "(All)",
                "dxDataGrid-filterRowResetOperationText": "Reset",
                "dxDataGrid-filterRowOperationEquals": "Equals",
                "dxDataGrid-filterRowOperationNotEquals": "Does not equal",
                "dxDataGrid-filterRowOperationLess": "Less than",
                "dxDataGrid-filterRowOperationLessOrEquals": "Less than or equal to",
                "dxDataGrid-filterRowOperationGreater": "Greater than",
                "dxDataGrid-filterRowOperationGreaterOrEquals": "Greater than or equal to",
                "dxDataGrid-filterRowOperationStartsWith": "Starts with",
                "dxDataGrid-filterRowOperationContains": "Contains",
                "dxDataGrid-filterRowOperationNotContains": "Does not contain",
                "dxDataGrid-filterRowOperationEndsWith": "Ends with",
                "dxDataGrid-filterRowOperationBetween": "Between",
                "dxDataGrid-filterRowOperationBetweenStartText": "Start",
                "dxDataGrid-filterRowOperationBetweenEndText": "End",
                "dxDataGrid-applyFilterText": "Apply filter",
                "dxDataGrid-trueText": "true",
                "dxDataGrid-falseText": "false",
                "dxDataGrid-sortingAscendingText": "Sort Ascending",
                "dxDataGrid-sortingDescendingText": "Sort Descending",
                "dxDataGrid-sortingClearText": "Clear Sorting",
                "dxDataGrid-editingSaveAllChanges": "Save changes",
                "dxDataGrid-editingCancelAllChanges": "Discard changes",
                "dxDataGrid-editingAddRow": "Add a row",
                "dxDataGrid-summaryMin": "Min: {0}",
                "dxDataGrid-summaryMinOtherColumn": "Min of {1} is {0}",
                "dxDataGrid-summaryMax": "Max: {0}",
                "dxDataGrid-summaryMaxOtherColumn": "Max of {1} is {0}",
                "dxDataGrid-summaryAvg": "Avg: {0}",
                "dxDataGrid-summaryAvgOtherColumn": "Avg of {1} is {0}",
                "dxDataGrid-summarySum": "Sum: {0}",
                "dxDataGrid-summarySumOtherColumn": "Sum of {1} is {0}",
                "dxDataGrid-summaryCount": "Count: {0}",
                "dxDataGrid-columnFixingFix": "Fix",
                "dxDataGrid-columnFixingUnfix": "Unfix",
                "dxDataGrid-columnFixingLeftPosition": "To the left",
                "dxDataGrid-columnFixingRightPosition": "To the right",
                "dxDataGrid-exportTo": "Export",
                "dxDataGrid-exportToExcel": "Export to Excel file",
                "dxDataGrid-excelFormat": "Excel file",
                "dxDataGrid-selectedRows": "Selected rows",
                "dxDataGrid-exportSelectedRows": "Export selected rows",
                "dxDataGrid-exportAll": "Export all data",
                "dxDataGrid-headerFilterEmptyValue": "(Blanks)",
                "dxDataGrid-headerFilterOK": "OK",
                "dxDataGrid-headerFilterCancel": "Cancel",
                "dxDataGrid-ariaColumn": "Column",
                "dxDataGrid-ariaValue": "Value",
                "dxDataGrid-ariaFilterCell": "Filter cell",
                "dxDataGrid-ariaCollapse": "Collapse",
                "dxDataGrid-ariaExpand": "Expand",
                "dxDataGrid-ariaDataGrid": "Data grid",
                "dxDataGrid-ariaSearchInGrid": "Search in data grid",
                "dxDataGrid-ariaSelectAll": "Select all",
                "dxDataGrid-ariaSelectRow": "Select row",
                "dxTreeList-ariaTreeList": "Tree list",
                "dxTreeList-editingAddRowToNode": "Add",
                "dxPager-infoText": "Page {0} of {1} ({2} items)",
                "dxPager-pagesCountText": "of",
                "dxPivotGrid-grandTotal": "Grand Total",
                "dxPivotGrid-total": "{0} Total",
                "dxPivotGrid-fieldChooserTitle": "Field Chooser",
                "dxPivotGrid-showFieldChooser": "Show Field Chooser",
                "dxPivotGrid-expandAll": "Expand All",
                "dxPivotGrid-collapseAll": "Collapse All",
                "dxPivotGrid-sortColumnBySummary": 'Sort "{0}" by This Column',
                "dxPivotGrid-sortRowBySummary": 'Sort "{0}" by This Row',
                "dxPivotGrid-removeAllSorting": "Remove All Sorting",
                "dxPivotGrid-dataNotAvailable": "N/A",
                "dxPivotGrid-rowFields": "Row Fields",
                "dxPivotGrid-columnFields": "Column Fields",
                "dxPivotGrid-dataFields": "Data Fields",
                "dxPivotGrid-filterFields": "Filter Fields",
                "dxPivotGrid-allFields": "All Fields",
                "dxPivotGrid-columnFieldArea": "Drop Column Fields Here",
                "dxPivotGrid-dataFieldArea": "Drop Data Fields Here",
                "dxPivotGrid-rowFieldArea": "Drop Row Fields Here",
                "dxPivotGrid-filterFieldArea": "Drop Filter Fields Here",
                "dxScheduler-editorLabelTitle": "Subject",
                "dxScheduler-editorLabelStartDate": "Start Date",
                "dxScheduler-editorLabelEndDate": "End Date",
                "dxScheduler-editorLabelDescription": "Description",
                "dxScheduler-editorLabelRecurrence": "Repeat",
                "dxScheduler-openAppointment": "Open appointment",
                "dxScheduler-recurrenceNever": "Never",
                "dxScheduler-recurrenceDaily": "Daily",
                "dxScheduler-recurrenceWeekly": "Weekly",
                "dxScheduler-recurrenceMonthly": "Monthly",
                "dxScheduler-recurrenceYearly": "Yearly",
                "dxScheduler-recurrenceEvery": "Every",
                "dxScheduler-recurrenceEnd": "End repeat",
                "dxScheduler-recurrenceAfter": "After",
                "dxScheduler-recurrenceOn": "On",
                "dxScheduler-recurrenceRepeatDaily": "day(s)",
                "dxScheduler-recurrenceRepeatWeekly": "week(s)",
                "dxScheduler-recurrenceRepeatMonthly": "month(s)",
                "dxScheduler-recurrenceRepeatYearly": "year(s)",
                "dxScheduler-switcherDay": "Day",
                "dxScheduler-switcherWeek": "Week",
                "dxScheduler-switcherWorkWeek": "Work Week",
                "dxScheduler-switcherMonth": "Month",
                "dxScheduler-switcherAgenda": "Agenda",
                "dxScheduler-switcherTimelineDay": "Timeline Day",
                "dxScheduler-switcherTimelineWeek": "Timeline Week",
                "dxScheduler-switcherTimelineWorkWeek": "Timeline Work Week",
                "dxScheduler-switcherTimelineMonth": "Timeline Month",
                "dxScheduler-recurrenceRepeatOnDate": "on date",
                "dxScheduler-recurrenceRepeatCount": "occurrence(s)",
                "dxScheduler-allDay": "All day",
                "dxScheduler-confirmRecurrenceEditMessage": "Do you want to edit only this appointment or the whole series?",
                "dxScheduler-confirmRecurrenceDeleteMessage": "Do you want to delete only this appointment or the whole series?",
                "dxScheduler-confirmRecurrenceEditSeries": "Edit series",
                "dxScheduler-confirmRecurrenceDeleteSeries": "Delete series",
                "dxScheduler-confirmRecurrenceEditOccurrence": "Edit appointment",
                "dxScheduler-confirmRecurrenceDeleteOccurrence": "Delete appointment",
                "dxScheduler-noTimezoneTitle": "No timezone",
                "dxScheduler-moreAppointments": "{0} more",
                "dxCalendar-todayButtonText": "Today",
                "dxCalendar-ariaWidgetName": "Calendar",
                "dxColorView-ariaRed": "Red",
                "dxColorView-ariaGreen": "Green",
                "dxColorView-ariaBlue": "Blue",
                "dxColorView-ariaAlpha": "Transparency",
                "dxColorView-ariaHex": "Color code",
                "dxTagBox-selected": "{0} selected",
                "dxTagBox-allSelected": "All selected ({0})",
                "dxTagBox-moreSelected": "{0} more",
                "vizExport-printingButtonText": "Print",
                "vizExport-titleMenuText": "Exporting/Printing",
                "vizExport-exportButtonText": "{0} file",
                "dxFilterBuilder-and": "And",
                "dxFilterBuilder-or": "Or",
                "dxFilterBuilder-notAnd": "Not And",
                "dxFilterBuilder-notOr": "Not Or",
                "dxFilterBuilder-addCondition": "Add Condition",
                "dxFilterBuilder-addGroup": "Add Group",
                "dxFilterBuilder-enterValueText": "<enter a value>",
                "dxFilterBuilder-filterOperationEquals": "Equals",
                "dxFilterBuilder-filterOperationNotEquals": "Does not equal",
                "dxFilterBuilder-filterOperationLess": "Less than",
                "dxFilterBuilder-filterOperationLessOrEquals": "Less than or equal to",
                "dxFilterBuilder-filterOperationGreater": "Greater than",
                "dxFilterBuilder-filterOperationGreaterOrEquals": "Greater than or equal to",
                "dxFilterBuilder-filterOperationStartsWith": "Starts with",
                "dxFilterBuilder-filterOperationContains": "Contains",
                "dxFilterBuilder-filterOperationNotContains": "Does not contain",
                "dxFilterBuilder-filterOperationEndsWith": "Ends with",
                "dxFilterBuilder-filterOperationIsBlank": "Is blank",
                "dxFilterBuilder-filterOperationIsNotBlank": "Is not blank"
            }
        });
    }
});