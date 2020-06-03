import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './checkbox.less'

export default class Checkbox extends Component {
    onChange = (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (this.props.onChange) {
            this.props.onChange(event)
        }
    }

    onClick = (event) => {
        event.preventDefault()
        event.stopPropagation()

        if(this.props.onClick) {
            this.props.onClick(event)
        }
    }

    render() {
        const checkboxClassName = classNames(
            'ant-checkbox',
            { 'ant-checkbox-checked': this.props.checked },
            { 'ant-checkbox-indeterminate': !this.props.checked && this.props.isIndeterminate })
        return (
            <div className="check-wrapper">
                <label className="ant-checkbox-wrapper">
                    <span className={checkboxClassName}>
                        <input
                            className="ant-checkbox-input"
                            type="checkbox"
                            onChange={this.onChange}
                            checked={this.props.checked}
                            onClick={this.onClick} />
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
        onClick: null,
        isIndeterminate: false,
    }

    static propTypes = {
        checked: PropTypes.bool,
        isIndeterminate: PropTypes.bool,
        onChange: PropTypes.func,
        onClick: PropTypes.func,
    }
}