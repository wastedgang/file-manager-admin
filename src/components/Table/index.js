import React, { Component } from 'react'
import propTypes from 'prop-types'

import './table.less'
import Column from './Column'

export default class Table extends Component {
    render() {
        console.log(this.props.dataSource)
        const columns = this.props.children.filter(item => item.type === Column)
        return (
            <div className="ant-table ant-table-small">
                <div className="ant-table-container">
                    <div className="ant-table-content">
                        <div className="table">
                            {
                                this.props.dataSource.map((rowData, index) => {
                                    return (
                                        <div className="table-row" key={index}>
                                            {
                                                columns.map(column => {
                                                    const columnProps = column.props
                                                    return (
                                                        <div>{rowData[columnProps.dataIndex]}</div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })

                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    static Column = Column

    static defaultProps = {
        dataSource: [],
        loading: false,
    }

    static propTypes = {
        dataSource: propTypes.array.isRequired,
        loading: propTypes.bool
    }
}
