import React, { Component, createRef } from 'react'
import { FixedSizeList as List } from 'react-window'
import propTypes from 'prop-types'
import Checkbox from './Checkbox'

import './table.less'
import Column from './Column'

export default class Table extends Component {
    headerRef = createRef()

    state = {
        headerWidth: null,
    }

    onCheckboxChange = (event, record) => {
        if(!this.props.rowSelection || !this.props.rowSelection.onChange) {
            return
        }
        const key = record[this.props.rowKey]
        const selectedRowKeys = this.props.rowSelection.selectedRowKeys.filter(item => item !== key)
        if(event.target.checked) {
            selectedRowKeys.push(key)
        }
        this.props.rowSelection.onChange(selectedRowKeys)
    }

    onCheckboxSelectAll = () => {
        console.log('onCheckboxSelectAll')
    }

    onCheckboxSelectInvert = () => {
        console.log('onCheckboxSelectInvert')
    }

    componentDidUpdate() {
        if (this.headerRef.current && this.headerRef.current.clientWidth && this.headerRef.current.clientWidth !== this.state.headerWidth) {
            this.setState({ headerWidth: this.headerRef.current.clientWidth })
        }
    }

    render() {
        const columns = this.props.children.filter(item => item.type === Column)

        let listHeight = 610
        if (this.props.height) {
            listHeight = this.props.height - this.props.itemSize <= 0 ? 0 : this.props.height - this.props.itemSize
        }

        const selectedKeyMap = {}
        if (this.props.rowSelection && this.props.rowSelection.selectedRowKeys) {
            for (let key of this.props.rowSelection.selectedRowKeys) {
                selectedKeyMap[key] = true
            }
        }
        return (
            <div className="ant-table ant-table-small" >
                <div className="ant-table-container">
                    <div className="ant-table-content">
                        <div className="table">
                            <div className="ant-table-thead" style={{ height: this.props.itemSize }} ref={this.headerRef}>
                                {!this.props.rowSelection ? null : (
                                    <div className="ant-table-cell ant-table-selection-column">
                                        <Checkbox onChange={this.changeAllChecked} />
                                    </div>
                                )}
                                {
                                    columns.map((column, columnIndex) => {
                                        const columnProps = column.props
                                        const style = {
                                            ...columnProps.style,
                                            textAlign: columnProps.align,
                                            // 高度设置
                                            height: this.props.itemSize,
                                        }
                                        if (columnProps.width)
                                            style.width = columnProps.width
                                        else if (columnProps.flex) {
                                            style.flex = columnProps.flex
                                        }

                                        return (
                                            <div key={columnIndex} className="ant-table-cell" style={style}>
                                                {columnProps.title}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <List
                                className="ant-table-tbody"
                                height={listHeight}
                                itemCount={this.props.dataSource.length}
                                itemSize={this.props.itemSize}
                                width={this.state.headerWidth}
                            >
                                {/* 生成行数据 */}
                                {({ index, style }) => {
                                    const rowData = this.props.dataSource[index]
                                    return (
                                        <div className="table-row" key={rowData[this.props.rowKey]} style={style}>
                                            {
                                                <>
                                                    {!this.props.rowSelection ? null : (
                                                        <div className="ant-table-cell ant-table-selection-column">
                                                            <Checkbox
                                                                onChange={(event) => this.onCheckboxChange(event, this.props.dataSource[index], index)}
                                                                checked={selectedKeyMap[rowData[this.props.rowKey]] ? true : false} />
                                                        </div>
                                                    )}
                                                    {
                                                        columns.map((column, columnIndex) => {
                                                            const columnProps = column.props
                                                            const style = {
                                                                ...columnProps.style,
                                                                textAlign: columnProps.align
                                                            }
                                                            if (columnProps.width)
                                                                style.width = columnProps.width
                                                            else if (columnProps.flex) {
                                                                style.flex = columnProps.flex
                                                            }

                                                            let itemRender = rowData[columnProps.dataIndex]
                                                            if (columnProps.render) {
                                                                itemRender = columnProps.render(itemRender, rowData, index)
                                                            }
                                                            return (
                                                                <div key={columnIndex} className="ant-table-cell" style={style}>
                                                                    {itemRender}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </>
                                            }
                                        </div>
                                    )
                                }}
                            </List>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    static Column = Column

    static SELECTION_ALL = "SELECT_ALL"
    static SELECTION_INVERT = "SELECT_INVERT"

    static defaultProps = {
        dataSource: [],
        loading: false,

        itemSize: 35,
        height: 610,

        rowSelection: {
            selectedRowKeys: [],
            selections: [],
            onChange: null,
        }
    }

    static propTypes = {
        dataSource: propTypes.array.isRequired,
        rowKey: propTypes.string.isRequired,
        loading: propTypes.bool,

        height: propTypes.number,
        itemSize: propTypes.number,

        rowSelection: propTypes.shape({
            selectedRowKeys: propTypes.oneOfType([
                propTypes.arrayOf(propTypes.string),
                propTypes.arrayOf(propTypes.number)
            ]).isRequired,
            onChange: propTypes.func.isRequired,
            selections: propTypes.arrayOf(propTypes.oneOfType([
                propTypes.oneOf([Table.SELECTION_ALL, Table.SELECTION_INVERT]),
                propTypes.shape({
                    text: propTypes.string,
                    onSelect: propTypes.func,
                })
            ]))
        }),
    }
}
