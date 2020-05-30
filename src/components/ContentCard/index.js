import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import './content-card.less'

export default class ContentCard extends Component {
    render() {
        let title = this.props.title
        if (this.props.description) {
            title = (
                <div className="table-header">
                    <div className="table-title">{this.props.title}</div>
                    <div className="table-desc">{this.props.description}</div>
                </div>
            )
        }
        return (
            // <div style={{position: 'relative', height: '100%'}}>
            <Card
                {...this.props}
                title={title}
                bordered={false}
                className="content-card"
                // style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                // bodyStyle={{ flex: 1, position: 'relative' }}
            >
                <div className="content-wrapper">
                    {this.props.children}
                </div>

            </Card>
            // </div>
        )
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.any,
    }
}
