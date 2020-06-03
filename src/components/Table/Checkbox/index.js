import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './checkbox.less'

export default class Checkbox extends Component {
    onChange = (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (this.props.onChange) {
            this.props.onChange(event)
        }
    }

    render() {
        return (
            <div className="check-wrapper">
                <label className="ant-checkbox-wrapper">
                    <span className={this.props.checked ? 'ant-checkbox ant-checkbox-checked' : 'ant-checkbox'}>
                        <input className="ant-checkbox-input" type="checkbox" onChange={this.onChange} checked={this.props.checked} />
                        <span className="ant-checkbox-inner"></span>
                    </span>
                    {!this.props.children ? null : (
                        <span style={{ padding: '0 8px' }}>{this.props.children}</span>
                    )}
                </label>
            </div>
        )
    }

    static defaultProps = {
        checked: false,
        onChange: null,
    }

    static propTypes = {
        checked: PropTypes.bool,
        onChange: PropTypes.func,
    }
}