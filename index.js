import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import FxBar from './components/fxBar'
const urla = 'http://localhost:5000/';

class ActualData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      ftrans: {}
    };
    this.alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.prevValue = [];
    this.interval;
  }

  componentWillMount() {
    this.loadData();
  }

  loadData() {
    axios.get('src/jsonData/mainData.json')
      .then(data => {
        this.setState({ data: data.data });
        var dupdata = this.state.data;
        for (var i = 0; i < dupdata.length; i++) {
          for (var j = 0; j < dupdata[i].length; j++) {
            if (dupdata[i][j]['url'].length > 0) {
              this.checkBlur(i, j, dupdata[i][j]['url']);
            }
          }
        }
      });
  }

  stringColor = (i, j, target, color) => {
    var data = this.state.data;
    if (data[i][j]["fx"]["op1i"]) {
      data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].map(function (obj, q) {
        if (obj["row"] == i && obj["column"] == j) {
          data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].splice(q, 1);
        }
      });
      data[i][j]["fx"]["formula"] = "";
      delete data[i][j]["fx"]["op1i"];
      delete data[i][j]["fx"]["op1j"];
      data[i][j]["fx"] = {};
    }
    if (data[i][j]["fx"]["op2i"]) {
      data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].map(function (obj, q) {
        if (obj["row"] == i && obj["column"] == j) {
          data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].splice(q, 1);
        }
      });
      data[i][j]["fx"]["formula"] = "";
      delete data[i][j]["fx"]["op2i"];
      delete data[i][j]["fx"]["op2j"];
      data[i][j]["fx"] = {};
    }
    data[i][j]['color'] = color;
    data[i][j]['value'] = target;

    this.setState({ data });
  }

  changeColor = (i, j, color) => {
    var dupdata = this.state.data;
    dupdata[i][j]["color"] = color;
    this.setState({ data: dupdata });
  }

  applyFunc = (j, a, i, color, op1, op2, op1i, op1j, op2i, op2j, operator) => {
    var data = this.state.data;
    var ans;
    if (op1 !== "") {
      if (operator == '+') {
        if (parseInt(data[op2i][op2j]['value'], 10))
          ans = op1 + parseInt(data[op2i][op2j]['value'], 10);
        else
          ans = op1 + 0;
      }
      else {
        if (parseInt(data[op2i][op2j]['value'], 10))
          ans = op1 - parseInt(data[op2i][op2j]['value'], 10);
        else
          ans = op1 - 0;
      }
    }
    else if (op2 !== "") {
      if (operator == '+') {
        if (parseInt(data[op1i][op1j]['value'], 10))
          ans = op2 + parseInt(data[op1i][op1j]['value'], 10);
        else
          ans = op2 + 0;
      }
      else {
        if (parseInt(data[op1i][op1j]['value'], 10))
          ans = parseInt(data[op1i][op1j]['value'], 10) - op2;
        else
          ans = 0 - op2;
      }
    }
    else if (op2i === "") {
      if (parseInt(data[op1i][op1j]['value'], 10))
        ans = parseInt(data[op1i][op1j]['value'], 10)
      else
        ans = 0;
    }
    else {
      var operator1, operator2;
      if (parseInt(data[op1i][op1j]['value'], 10))
        operator1 = parseInt(data[op1i][op1j]['value'], 10);
      else
        operator1 = 0;
      if (parseInt(data[op2i][op2j]['value'], 10))
        operator2 = parseInt(data[op2i][op2j]['value'], 10);
      else
        operator2 = 0;
      if (operator == '+') {
        ans = operator1 + operator2;
      }
      else {
        ans = operator1 - operator2;
      }
    }

    if (data[i][j]["fx"]["op1i"]) {
      data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].map(function (obj, q) {
        if (obj["row"] == i && obj["column"] == j) {
          data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].splice(q, 1);
        }
      });
      data[i][j]["fx"]["formula"] = "";
      delete data[i][j]["fx"]["op1i"];
      delete data[i][j]["fx"]["op1j"];
      data[i][j]["fx"] = {};
    }
    if (data[i][j]["fx"]["op2i"]) {
      data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].map(function (obj, q) {
        if (obj["row"] == i && obj["column"] == j) {
          data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].splice(q, 1);
        }
      });
      data[i][j]["fx"]["formula"] = "";
      delete data[i][j]["fx"]["op2i"];
      delete data[i][j]["fx"]["op2j"];
      data[i][j]["fx"] = {};
    }
    if (op1i !== "") {
      data[op1i][op1j]["dep"].push({ "row": i, "column": j });
      data[i][j]["fx"]["op1i"] = op1i;
      data[i][j]["fx"]["op1j"] = op1j;
    }
    if (op2i !== "") {
      data[op2i][op2j]["dep"].push({ "row": i, "column": j });
      data[i][j]["fx"]["op2i"] = op2i;
      data[i][j]["fx"]["op2j"] = op2j;
    }
    data[i][j]["fx"]["formula"] = a;
    data[i][j]["color"] = color;
    data[i][j]['value'] = ans;

    this.setState({ data });
  }

  handleDoubleClick = (item) => {
    var dupdata = this.state.data;
    var colName = item.id[0];
    var colNo = this.alpha.indexOf(colName);
    var rowNo = Number(item.id.substr(1, item.id.length));
    var val = "";
    if (Object.keys(dupdata[rowNo - 1][colNo]['fx']).length > 0) {
      val = dupdata[rowNo - 1][colNo]['fx']['formula'];
    }
    else if (dupdata[rowNo - 1][colNo]['url'].length > 0) {
      val = dupdata[rowNo - 1][colNo]['url'];
    }
    else {
      val = dupdata[rowNo - 1][colNo]['value'];
    }
    this.setState({ ftrans: { r: rowNo - 1, c: colNo, v: val } });
  }

  handleChange = (item) => {
    var dupdata = this.state.data;
    var colName = item.id[0];
    var colNo = this.alpha.indexOf(colName);
    var rowNo = Number(item.id.substr(1, item.id.length));
    var val = "";
    if (Object.keys(dupdata[rowNo - 1][colNo]['fx']).length > 0) {
      val = dupdata[rowNo - 1][colNo]['fx']['formula'];
    }
    else if (dupdata[rowNo - 1][colNo]['url'].length > 0) {
      val = dupdata[rowNo - 1][colNo]['url'];
    }
    else {
      val = dupdata[rowNo - 1][colNo]['value'];
    }
    this.setState({ ftrans: { r: rowNo - 1, c: colNo, v: val } });
  }

  refCallback = (item) => {
    if (item) {
      item.contentEditable = true;
      item.getDOMNode().ondblclick = this.handleDoubleClick.bind(this, item);
      item.getDOMNode().onkeyup = this.handleChange.bind(this, item);
    }
  }

  checkFocus = (event) => {
    this.prevValue.push(event.target.innerText);
  }

  checkBlur = (i, j, q, event) => {
    var dupdata = this.state.data;
    var len = dupdata[0].length;
    var target;
    if (q != "zaq")
      target = q;
    else
      target = event.target.innerText;
    if (dupdata[i][j]["value"] != target) {
      if (this.prevValue[this.prevValue.length - 1] != target) {
        if (target == parseInt(target, 10) || target == "") {
          dupdata[i][j]["color"] = "darkgreen";
          dupdata[i][j]["value"] = target;
          this.setState({ data: dupdata });
          if (dupdata[i][j]["dep"].length) {
            var deep = [];
            deep = dupdata[i][j]["dep"];
            for (var k = 0; k < deep.length; k++) {
              var fxrow = deep[k]["row"];
              var fxcol = deep[k]["column"];
              var fxformula = dupdata[fxrow][fxcol]["fx"]["formula"];
              this.checkBlur(fxrow, fxcol, fxformula);
            }
          }
        }
        else {
          if (target[0] == '=' && target[1] == '(' && target[target.length - 1] == ')') {
            if (target[2] == parseInt(target[2], 10)) {
              var z = 2, num = "";
              for (z = 2; z < target.length; z++) {
                if (target[z] != '+' && target[z] != '-' && target[z] != ')') {
                  num = num + target[z];
                }
                else
                  break;
              }
              num = Number(num);
              var op1 = num;
              if (target[z] == ')') {
                target = num;
                this.stringColor(i, j, target, "darkblue");
                var me = this;
                setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
              }
              else {
                if (target[z] == '+' || target[z] == '-') {
                  var operator = target[z];
                  z = z + 1;
                  if (target[z] == parseInt(target[z], 10)) {
                    let c = z, numb = "";
                    while (target[c] != ')') {
                      numb = numb + target[c++];
                    }
                    numb = Number(numb);
                    var op2 = numb;
                    if (operator == '+')
                      target = op1 + op2;
                    else
                      target = op1 - op2;
                    this.stringColor(i, j, target, "darkblue");
                    var me = this;
                    setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
                  }
                  else if (this.alpha.indexOf(target[z]) > -1 && this.alpha.indexOf(target[z]) < len) {
                    let k = z + 1, nu = "";
                    while (target[k] !== ')') {
                      nu = nu + target[k++];
                    }
                    nu = Number(nu);
                    if (dupdata[nu - 1]) {
                      var op2i = nu - 1;
                      var op2j = this.alpha.indexOf(target[z]);
                      this.applyFunc(j, target, i, "darkblue", op1, "", "", "", op2i, op2j, operator);
                      var me = this;
                      setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
                    }
                    else {
                      this.stringColor(i, j, target, "darkblue");
                      var me = this;
                      setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
                    }
                  }
                  else {
                    this.stringColor(i, j, target, "darkblue");
                    var me = this;
                    setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
                  }
                }
                else {
                  this.stringColor(i, j, target, "darkblue");
                  var me = this;
                  setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
                }
              }
            }
            else if (this.alpha.indexOf(target[2]) > -1 && this.alpha.indexOf(target[2]) < len) {
              let z = 3, num = "";
              for (z = 3; z < target.length; z++) {
                if ((target[z] !== '+') && (target[z] !== '-') && (target[z] !== ')')) {
                  num = num + target[z];
                }
                else
                  break;
              }
              num = Number(num);
              if (dupdata[num - 1]) {
                var op1i = num - 1;
                var op1j = this.alpha.indexOf(target[2]);
                if (target[z] == ')') {
                  this.applyFunc(j, target, i, "darkblue", "", "", op1i, op1j, "", "", "");
                  var me = this;
                  setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
                }
                else {
                  if (target[z] == '+' || target[z] == '-') {
                    var operator = target[z];
                    z = z + 1;
                    if (target[z] == parseInt(target[z], 10)) {
                      let c = z, numb = "";
                      while (target[c] !== ')') {
                        numb = numb + target[c++];
                      }
                      numb = Number(numb);
                      var op2 = numb;
                      this.applyFunc(j, target, i, "darkblue", "", op2, op1i, op1j, "", "", operator);
                      var me = this;
                      setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
                    }
                    else if (this.alpha.indexOf(target[z]) > -1 && this.alpha.indexOf(target[z]) < len) {
                      let k = z + 1, nu = "";
                      while (target[k] !== ')') {
                        nu = nu + target[k++];
                      }
                      nu = Number(nu);
                      if (dupdata[nu - 1]) {
                        var op2i = nu - 1;
                        var op2j = this.alpha.indexOf(target[z]);
                        this.applyFunc(j, target, i, "darkblue", "", "", op1i, op1j, op2i, op2j, operator);
                        var me = this;
                        setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
                      }
                      else {
                        this.stringColor(i, j, target, "darkblue");
                        var me = this;
                        setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
                      }
                    }
                    else {
                      this.stringColor(i, j, target, "darkblue");
                      var me = this;
                      setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
                    }
                  }
                  else {
                    this.stringColor(i, j, target, "darkblue");
                    var me = this;
                    setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
                  }
                }
              }
              else {
                this.stringColor(i, j, target, "darkblue");
                var me = this;
                setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
              }
            }
            else {
              this.stringColor(i, j, target, "darkblue");
              var me = this;
              setTimeout(function () { me.changeColor(i, j, "black"); }, 500);
            }
          }
          else if (target[0] == 'u' && target[1] == 'r' && target[2] == 'l') {
            var regex = new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$");

            var urlTest = target.slice(4, target.indexOf(','));
            var timer = target.slice(target.indexOf(',') + 1, target.indexOf(')'));
            if (regex.test(urlTest)) {
              this.writeUrl(i, j, target);
              this.runUrl(i, j);
              this.interval = setInterval(() => { this.runUrl(i, j) }, timer);
            }
            else {
              this.stringColor(i, j, target, "red");
              var me = this;
              setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
            }
          }
          else {
            this.stringColor(i, j, target, "red");
          }
        }
      }
    }
  }

  writeUrl = (row, col, urlf) => {
    var dupdata = this.state.data;
    dupdata[row][col]["url"] = urlf;
    this.setState({ data: dupdata });
  }

  runUrl = (row, col) => {
    var dupdata = this.state.data;
    var target = dupdata[row][col]["url"];
    var urlTest = target.slice(4, target.indexOf(','));
    var timer = target.slice(target.indexOf(',') + 1, target.indexOf(')'));
    var response;
    var me = this;
    if (target.length > 0) {
      axios.get(urlTest)
        .then(data => {
          if (data['status'] == 200) {
            response = data['data']['a'];
            dupdata[row][col]["value"] = response;
            this.setState({ data: dupdata });
          }
          else {
            dupdata[row][col]["value"] = "ERROR!";
            dupdata[row][col]["url"] = "";
            this.setState({ data: dupdata });
          }
        })
        .catch(function (error) {
          console.log(error);
          dupdata[row][col]["value"] = "ERROR!";
          dupdata[row][col]["url"] = "";
          dupdata[row][col]["color"] = "red";
          me.setState({ data: dupdata });
          clearInterval(me.interval);
        });
    }
  }

  saveData = () => {
    var dupdata = this.state.data;
    for (var i = 0; i < dupdata.length; i++) {
      for (var j = 0; j < dupdata[i].length; j++) {
        if (dupdata[i][j]["color"] !== "") {
          dupdata[i][j]["color"] = "";
        }
      }
    }
    this.setState({ data: dupdata });
    const request = axios.post(urla, this.state.data);
    this.loadData();
  }

  addRow = () => {
    var dupdata = this.state.data;
    var colLen = dupdata[0].length;
    var extraRow = [];
    for (var i = 0; i < colLen; i++) {
      extraRow.push({ "value": "", "color": "", "fx": {}, "dep": [], "url": "" });
    }
    dupdata.push(extraRow);
    this.setState({ data: dupdata });
  }

  addColumn = () => {
    var dupdata = this.state.data;
    var rowLen = dupdata.length;
    for (var i = 0; i < rowLen; i++) {
      dupdata[i].push({ "value": "", "color": "", "fx": {}, "dep": [], "url": "" });
    }
    this.setState({ data: dupdata });
  }

  delRow = (rowNo) => {
    var data = this.state.data;
    data[rowNo].map(function (col, j) {
      if (col["dep"].length > 0) {
        for (var i = 0; i < col["dep"].length; i++) {
          var rows = col["dep"][i]["row"];
          var cols = col["dep"][i]["column"];

          data[rows][cols]["fx"]["formula"] = "#REF";
          data[rows][cols]["value"] = "#REF";

          if (data[rows][cols]["fx"]["op1i"] == rowNo) {
            data[rows][cols]["fx"]["op1i"] = "";
            data[rows][cols]["fx"]["op1j"] = "";
          }
          else {
            data[rows][cols]["fx"]["op2i"] = "";
            data[rows][cols]["fx"]["op2j"] = "";
          }
        }
      }
      if (Object.keys(col["fx"]).length > 0) {
        if (col["fx"]["op1i"]) {
          var op1i = col["fx"]["op1i"];
          var op1j = col["fx"]["op1j"];
          data[op1i][op1j]["dep"].map(function (depRow, l) {
            if (depRow["row"] == rowNo) {
              data[op1i][op1j]["dep"].splice(l, 1);
            }
          });
        }
        if (col["fx"]["op2i"]) {
          var op2i = col["fx"]["op2i"];
          var op2j = col["fx"]["op2j"];
          data[op2i][op2j]["dep"].map(function (depRow, l) {
            if (depRow["row"] == rowNo) {
              data[op2i][op2j]["dep"].splice(l, 1);
            }
          });
        }
      }
    });
    data.map(function (row, i) {
      row.map(function (col, j) {
        if (col["dep"].length > 0) {
          for (var z = 0; z < col["dep"].length; z++) {
            if (col["dep"][z]["row"] > rowNo) {
              col["dep"][z]["row"] = col["dep"][z]["row"] - 1;
            }
          }
        }

        if (Object.keys(col["fx"]).length > 0) {
          if (col["fx"]["op1i"] > rowNo) {
            col["fx"]["op1i"] = col["fx"]["op1i"] - 1;
            var temp = col["fx"]["formula"];
            if (temp.indexOf("+") > -1)
              var oper = temp.indexOf("+");
            else
              var oper = temp.indexOf("-");
            col["fx"]["formula"] = temp.substring(0, 3) + (col["fx"]["op1i"] + 1) + temp.substring(oper, temp.length);
          }
          if (col["fx"]["op2i"] > rowNo) {
            col["fx"]["op2i"] = col["fx"]["op2i"] - 1;
            var temp = col["fx"]["formula"];
            if (temp.indexOf("+") > -1)
              var oper = temp.indexOf("+");
            else
              var oper = temp.indexOf("-");
            col["fx"]["formula"] = temp.substring(0, oper + 2) + (col["fx"]["op2i"] + 1) + ")";
          }
        }
      });
    });

    data.splice(rowNo, 1);
    this.setState({ data });
  }

  delCol = (colNo) => {
    var data = this.state.data;
    var me = this
    data.map(function (row, i) {
      if (row[colNo]["dep"].length > 0) {
        for (var j = 0; j < row[colNo]["dep"].length; j++) {
          var rows = row[colNo]["dep"][j]["row"];
          var cols = row[colNo]["dep"][j]["column"];
          data[rows][cols]["fx"]["formula"] = "#REF";
          data[rows][cols]["value"] = "#REF";

          if (data[rows][cols]["fx"]["op1j"] == colNo) {
            data[rows][cols]["fx"]["op1i"] = "";
            data[rows][cols]["fx"]["op1j"] = "";
          }
          else {
            data[rows][cols]["fx"]["op2i"] = "";
            data[rows][cols]["fx"]["op2j"] = "";
          }
        }
      }

      if (Object.keys(row[colNo]["fx"]).length > 0) {
        if (row[colNo]["fx"]["op1i"]) {
          var op1i = row[colNo]["fx"]["op1i"];
          var op1j = row[colNo]["fx"]["op1j"];
          data[op1i][op1j]["dep"].map(function (depRow, l) {
            if (depRow["column"] == colNo) {
              data[op1i][op1j]["dep"].splice(l, 1);
            }
          });
        }
        if (row[colNo]["fx"]["op2i"]) {
          var op2i = row[colNo]["fx"]["op2i"];
          var op2j = row[colNo]["fx"]["op2j"];
          data[op2i][op2j]["dep"].map(function (depRow, l) {
            if (depRow["column"] == colNo) {
              data[op2i][op2j]["dep"].splice(l, 1);
            }
          });
        }
      }
    });

    data.map(function (row, i) {
      row.map(function (col, j) {
        if (Object.keys(col["fx"]).length > 0) {
          if (col["fx"]["op1j"] > colNo) {
            col["fx"]["op1j"] = col["fx"]["op1j"] - 1;
            var newCol = me.alpha[col["fx"]["op1j"]];
            col["fx"]["formula"] = col["fx"]["formula"].substr(0, 2) + newCol + col["fx"]["formula"].substr(3, col["fx"]["formula"].length);
          }
          if (col["fx"]["op2j"] > colNo) {
            col["fx"]["op2j"] = col["fx"]["op2j"] - 1;
            var temp = col["fx"]["formula"];
            if (temp.indexOf("+") > -1)
              var oper = temp.indexOf("+") + 1;
            else
              var oper = temp.indexOf("-") + 1;
            var newCol = me.alpha[col["fx"]["op2j"]];
            col["fx"]["formula"] = col["fx"]["formula"].substr(0, oper) + newCol + col["fx"]["formula"].substr(oper + 1, col["fx"]["formula"].length);
          }
        }

        if (col["dep"].length > 0) {
          for (var z = 0; z < col["dep"].length; z++) {
            if (col["dep"][z]["column"] > colNo) {
              col["dep"][z]["column"] = col["dep"][z]["column"] - 1;
            }
          }
        }
      });
    });

    data.map(function (row, i) {
      row.splice(colNo, 1);
    });

    this.setState({data});
  }

  renderHead = (data) => {
    var dupData = data;
    if (dupData[0]) {
      var len = dupData[0].length;
      var a = [<th key="blank"></th>];
      var me = this;
      for (var i = 0; i < dupData[0].length; i++) {
        a.push(<th key={i}>{this.alpha[i]} <button style={{ color: 'red' }} id={i} onClick={me.delCol.bind(me,i)} >X</button></th>);
      }
      return (<tr key="header">{a}</tr>);
    }
  }

  renderData = (data) => {
    var a = [], b = [];
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var dupdata = row;
      a.push(<td key={i + 1}>{i + 1}</td>);
      for (var j = 0; j < dupdata.length; j++) {
        var s = this.alpha[j] + (i + 1);
        a.push(
          <td
            ref={function (e) { if (e) e.contentEditable = true; }}
            key={s}
            id={s}
            style={{ color: dupdata[j]['color'] }}
            className={s}
            onFocus={this.checkFocus.bind(this)}
            onBlur={this.checkBlur.bind(this, i, j, "zaq")}
            ref={this.refCallback}
          >{dupdata[j]['value']}</td>
        );
      }
      b.push(<tr key={i}>{a} <td id="button"><button id={i} style={{ color: 'red' }} onClick={this.delRow.bind(this, i)}>X</button></td></tr>);
      a = [];
    }
    return b;
  }

  fbarSet = (value) => {
    var col = value.c;
    var row = value.r;
    var colName = this.alpha[col];
    var rowNo = Number(row) + 1;
    var id = colName + rowNo;
    var elem = document.getElementById(id);
    elem.innerText = value.v;
  }

  render() {
    return (
      <div>
        <button id="save" onClick={this.saveData.bind(this)}>SAVE</button>
        <button id="addRow" onClick={this.addRow.bind(this)}>ADD ROW</button>
        <button id="addCol" onClick={this.addColumn.bind(this)}>ADD COLUMN</button>
        <FxBar fvalue={this.state.ftrans} getfvalue={this.fbarSet} fxblur={this.checkBlur} />
        <table>
          <thead>{this.renderHead(this.state.data)}</thead>
          <tbody>{this.renderData(this.state.data)}</tbody>
        </table>
      </div>
    );
  }
}
ReactDOM.render(<ActualData />, document.querySelector('.container'));
