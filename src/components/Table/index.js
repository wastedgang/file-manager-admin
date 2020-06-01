import React, { Component, Fragment } from 'react'
import { FixedSizeList as List } from 'react-window'
import propTypes from 'prop-types'

import './table.less'
import Column from './Column'

export default class Table extends Component {
    render() {
        const columns = this.props.children.filter(item => item.type === Column)

        const Row = ({ index, style }) => {
            const rowData = this.props.dataSource[index]
            return (
                <div className="table-row" key={rowData[this.props.rowKey]} style={style}>
                    {
                        <Fragment>
                            {!this.props.rowSelection ? null : (
                                <div className="ant-table-cell ant-table-selection-column">
                                    <input type="checkbox"/>
                                </div>
                            )}
                            {
                                columns.map((column, columnIndex) => {
                                    const columnProps = column.props
                                    const style = {
                                        flex: columnProps.flex,
                                        ...columnProps.style,
                                        textAlign: columnProps.align
                                    }
                                    if (columnProps.width)
                                        style.width = columnProps.width

                                    let key = columnIndex
                                    if (columnProps.dataIndex && rowData[columnProps.dataIndex]) {
                                        key = rowData[columnProps.dataIndex]
                                    }

                                    let itemRender = rowData[columnProps.dataIndex]
                                    if (columnProps.render) {
                                        itemRender = columnProps.render(itemRender, rowData, index)
                                    }
                                    return (
                                        <div key={key} className="ant-table-cell" style={style}>
                                            {itemRender}
                                        </div>
                                    )
                                })
                            }
                        </Fragment>

                    }
                </div>
            )
        }
        return (
            <div className="ant-table ant-table-small" >
                <div className="ant-table-container">
                    <div className="ant-table-content">
                        <div className="table">
                            <div className="ant-table-thead">
                                {!this.props.rowSelection ? null : (
                                    <div className="ant-table-cell ant-table-selection-column"></div>
                                )}
                                {
                                    columns.map((column, index) => {
                                        const columnProps = column.props
                                        const style = {
                                            flex: columnProps.flex,
                                            ...columnProps.style,
                                            textAlign: columnProps.align
                                        }
                                        return (
                                            <div key={index} className="ant-table-cell" style={style}>
                                                {columnProps.title}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <List
                                className="ant-table-tbody"
                                height={610}
                                itemCount={this.props.dataSource.length}
                                itemSize={35}
                                width={850}
                            >
                                {Row}
                            </List>
                            {/* <div className="ant-table-tbody">
                                {rows}
                            </div> */}
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    static Column = Column

    static defaultProps = {
        dataSource: [],
        loading: false,
    }

    static propTypes = {
        dataSource: propTypes.array.isRequired,
        rowKey: propTypes.string.isRequired,
        loading: propTypes.bool,
    }
}
