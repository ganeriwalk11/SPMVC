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
        this.setState({data : data.data});
      });
  }

    checkFocus(event) {
        this.prevValue.push(event.target.innerText);
    }

    saveData() {
        var dupdata = this.state.data.length;
        for(var i=0;i<dupdata;i++)
        {
            for(var j=0; j<dupdata[i].length;j++)
            {
                if(dupdata[i][j]["color"] !== "")
                {
                    dupdata[i][j]["color"] = "";
                }
            }    
        }
        this.setState({data : dupdata});
        const request = axios.post(urla, this.state.data);
    }

    renderHead = (data) => {
        var dupData = data;
        if (dupData[0]) {
            var len = dupData[0].length;
            var a = [<th key="blank"></th>];
            var me = this;
            for (var i = 0; i < dupData.length; i++) {
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
                    /*onBlur={this.checkBlur.bind(this, i, j, "zaq")}
                    onClick={this.handleDoubleClick.bind(this)}*/
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
                <table>
                    <thead>{this.renderHead(this.state.data)}</thead>
                    <tbody>{this.renderData(this.state.data)}</tbody>
                </table>
            </div>
        );
    }
}

ReactDOM.render(<ActualData />, document.querySelector('.container'));
