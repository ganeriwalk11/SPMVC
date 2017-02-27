import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const urla = 'http://localhost:5000/';

class ActualData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.prevValue = [];
  }

  componentWillMount() {
    this.loadData();
  }

  loadData() {
    axios.get('src/jsonData/mainData.json')
      .then(data => {
        this.setState({ data: data.data });
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

    this.setState({data});
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
    console.log(target[0], target[1], target[target.length - 1]);
    if (dupdata[i][j]["value"] != target) {
      if (this.prevValue[this.prevValue.length - 1] != target) {
        if (target == parseInt(target, 10) || target == "") {
          dupdata[i][j]["color"] = "darkgreen";
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
        else if (target[0] == '=' && target[1] == '(' && target[target.length - 1] == ')') {
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
          }

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

        }
      }
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

  renderHead = (data) => {
    var dupData = data;
    if (dupData[0]) {
      var len = dupData[0].length;
      var a = [<th key="blank"></th>];
      var me = this;
      for (var i = 0; i < dupData[0].length; i++) {
        a.push(<th key={i}>{this.alpha[i]}</th>);
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
          /*onClick={this.handleDoubleClick.bind(this)}*/
          >{dupdata[j]['value']}</td>
        );
      }
      b.push(<tr key={i}>{a}</tr>);
      a = [];
    }
    return b;
  }

  render() {
    return (
      <div>
        <button id="save" onClick={this.saveData.bind(this)}>SAVE</button>
        <button id="addRow" onClick={this.addRow.bind(this)}>ADD ROW</button>
        <button id="addCol" onClick={this.addColumn.bind(this)}>ADD COLUMN</button>
        <table>
          <thead>{this.renderHead(this.state.data)}</thead>
          <tbody>{this.renderData(this.state.data)}</tbody>
        </table>
      </div>
    );
  }
}
ReactDOM.render(<ActualData />, document.querySelector('.container'));
