import React, { Component, createRef } from 'react'
import { Card } from 'antd'
import PropTypes from 'prop-types'
import { Table } from '@/components'

export default class TableCard extends Component {
    wrapperRef = createRef()

    state = {
        wrapperHeight: null,
    }

    componentDidUpdate() {
        if(this.wrapperRef.current && this.wrapperRef.current.clientHeight && this.wrapperRef.current.clientHeight !== this.state.wrapperHeight) {
            this.setState({wrapperHeight: this.wrapperRef.current.clientHeight})
        }
    }

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
            <Card
                title={title}
                extra={this.props.extra}
                bordered={false}
                className="content-card"
            >
                <div className="content-wrapper" ref={this.wrapperRef}>
                    <Table
                        dataSource={this.props.dataSource}
                        rowSelection={this.props.rowSelection}
                        selectedRowKeys={this.props.selectedRowKeys}
                        rowKey={this.props.rowKey}
                        
                        height={this.state.wrapperHeight}
                    >
                        {this.props.children}
                    </Table>
                </div>
            </Card>
        )
    }

    static defaultProps = {
        dataSource: [],
        loading: false,
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.any,
        extra: PropTypes.any,

        loading: PropTypes.bool,

        dataSource: PropTypes.array.isRequired,
        rowKey: PropTypes.string.isRequired,
        loading: PropTypes.bool,
    }
}
