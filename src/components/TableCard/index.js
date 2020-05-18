import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import './tablecard.less'

export default class TableCard extends Component {
    render() {
        return (
            <Card
                {...this.props}
                title={
                    (<div className="table-header">
                        <div className="table-title">{this.props.title}</div>
                        <div className="table-desc">{this.props.description}</div>
                    </div>
                    )
                }
                bordered={false}
            >
                {this.props.children}
            </Card>
        )
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }
}
