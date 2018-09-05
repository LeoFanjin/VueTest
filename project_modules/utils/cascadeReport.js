import _ from "underscore";

var reportTypeConvertor = {
  //级联类型转换(显示最后一级)
  convertLastReportType(_self, reportType, reportTypeData) {
    var label = '';
    var tempArray = reportType.split('_');
    var reportTypeArray = [];
    for(var i = 0; i < tempArray.length; i++) {
      if(i == 0) {
        reportTypeArray.push(tempArray[i]);
      }else{
        reportTypeArray.push(reportTypeArray[i - 1] + '_' + tempArray[i]);
      }
    }
    var result = null;
    for(var j = 0; j < reportTypeArray.length; j++) {
      if(j == 0) {
        // result = _.findWhere(_self.$store.state.cascadeReportType, {value: reportTypeArray[0]});
        result = _.findWhere(reportTypeData, {typeCode: reportTypeArray[0]});
        // label = result.label;
      }else{
        // var result = _.findWhere(result.children, {value: reportTypeArray[j]});
        result = _.findWhere(reportTypeData, {typeCode: reportTypeArray[j]});
        // label = result.label;
      }
    }
    if(result) {
      // label = result.label;
      label = result.typeName;
    }
    return label;
  },
  //转换首级类型
  convertTopReportType(_self, reportType, reportTypeData) {
    var label = '';
    var tempArray = reportType.split('_');
    var result = null;
    // result = _.findWhere(_self.$store.state.cascadeReportType, {value: tempArray[0]});
    result = _.findWhere(reportTypeData, {typeCode: tempArray[0]});
    if(result) {
      // label = result.label;
      label = result.typeName;
    }
    return label;
  },
  //转换到最后一级类型
  convertCascadeReportType(_self, reportType, reportTypeData) {
    var label = '';
    var tempArray = reportType.split('_');
    var reportTypeArray = [];
    for(var i = 0; i < tempArray.length; i++) {
      if(i == 0) {
        reportTypeArray.push(tempArray[i]);
      }else{
        reportTypeArray.push(reportTypeArray[i - 1] + '_' + tempArray[i]);
      }
    }
    // var result = _.findWhere(_self.$store.state.cascadeReportType, {value: reportTypeArray[0]});
    var result = _.findWhere(reportTypeData, {typeCode: reportTypeArray[0]});
    for(var k = 0; k < reportTypeArray.length; k++) {
      if(k == 0) {
        // label = result.label;
        label = result.typeName;
      }else if(k > 0 && k < 3) {
        // var result = _.findWhere(result.children, {value: reportTypeArray[k]});
        let result = _.findWhere(reportTypeData, {typeCode: reportTypeArray[k]});
        // label += '/'+result.label;
        label += '/' + result.typeName;
      }
    }
    return label;
  }
};

module.exports = reportTypeConvertor;
