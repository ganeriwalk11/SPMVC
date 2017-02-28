import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class FxBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <table>
                    <tbody><tr>
                        <td
                            ref={function (e) { if (e) e.contentEditable = true; }}
                            onKeyUp={this.handleChange.bind(this)}
                            onBlur={this.funcBlur.bind(this)}
                        >
                            {this.props.fvalue.v}
                        </td>
                    </tr></tbody>
                </table>
            </div>
        );
    }

    handleChange = (event) => {
        this.props.fvalue.v = event.target.innerText;
        this.props.getfvalue(this.props.fvalue);
    }

    funcBlur = () => {
        var row = Number(this.props.fvalue.r);
        var col = Number(this.props.fvalue.c);
        this.props.fxblur(row, col, this.props.fvalue.v)
    }
}

export default FxBar;
