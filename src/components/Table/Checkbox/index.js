import React, { Component } from 'react'
import './checkbox.less'

export default class Checkbox extends Component {
    state = {
        isCheck:false
    }
    check = (e) => {
        this.setState({
            isCheck: !e.target.checked
        })
        this.props.onChange(e);
    }
    render() {
        return (
            <div className="check-wrapper">
                <label className="ant-checkbox-wrapper">
                    <span className={this.state.isCheck?'ant-checkbox ant-checkbox-checked':'ant-checkbox'}>
                        <input className="ant-checkbox-input" type="checkbox" onChange={this.check}/>
                        <span className="ant-checkbox-inner"></span>
                    </span>
                    {!this.props.children?null:(
                        <span style={{padding:'0 8px'}}>{this.props.children}</span>
                    )}
                </label>
            </div>
        )
    }
}