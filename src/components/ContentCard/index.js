import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import './content-card.less'

export default class ContentCard extends Component {
    render() {
        let title = this.props.title
        if(this.props.description) {
            title = (
                <div className="table-header">
                    <div className="table-title">{this.props.title}</div>
                    <div className="table-desc">{this.props.description}</div>
                </div>
            )
        }
        return (
            <Card
                {...this.props}
                title={title}
                bordered={false}
            >
                {this.props.children}
            </Card>
        )
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.any,
    }
}
