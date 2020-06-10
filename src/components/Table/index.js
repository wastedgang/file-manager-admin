import React, { Component, createRef } from 'react'
import { FixedSizeList as List } from 'react-window'
import { Menu, Dropdown, Spin, Tooltip  } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import propTypes from 'prop-types'

import './table.less'
import Column from './Column'
import Checkbox from './Checkbox'
import { getSpanWidth } from '@/assets/utils.js'

export default class Table extends Component {
    headerRef = createRef()

    state = {
        headerWidth: null,
        selectedRowKeys: {},
    }

    getSelectedKeyMap = () => {
        const selectedKeyMap = {}
        if (this.props.rowSelection && this.props.rowSelection.selectedRowKeys) {
            for (let key of this.props.rowSelection.selectedRowKeys) {
                selectedKeyMap[key] = true
            }
        }
        return selectedKeyMap
    }

    onCheckboxChange = (event, record) => {
        if (!this.props.rowSelection || !this.props.rowSelection.onChange) {
            return
        }
        const key = record[this.props.rowKey]
        const selectedRowKeys = this.props.rowSelection.selectedRowKeys.filter(item => item !== key)
        if (event.target.checked) {
            selectedRowKeys.push(key)
        }
        this.props.rowSelection.onChange(selectedRowKeys)
    }

    onHeaderCheckboxClick = () => {
        if (!this.props.rowSelection || !this.props.rowSelection.onChange) {
            return
        }

        const selectedKeyMap = this.getSelectedKeyMap()
        const selectedKeyLength = Object.keys(selectedKeyMap).length
        if (selectedKeyLength === this.props.dataSource.length) {
            this.props.rowSelection.onChange([])
        } else {
            this.props.rowSelection.onChange(this.props.dataSource.map(item => item[this.props.rowKey]))
        }
    }

    onCheckboxSelectAll = () => {
        this.props.rowSelection.onChange(this.props.dataSource.map(item => item[this.props.rowKey]))
    }

    onCheckboxSelectInvert = () => {
        if (!this.props.rowSelection || !this.props.rowSelection.onChange) {
            return
        }

        const selectedKeyMap = this.getSelectedKeyMap()
        this.props.rowSelection.onChange(this.props.dataSource.map(item => item[this.props.rowKey]).filter(key => !selectedKeyMap[key]))
    }

    componentDidUpdate() {
        if (this.headerRef.current && this.headerRef.current.clientWidth && this.headerRef.current.clientWidth !== this.state.headerWidth) {
            this.setState({ headerWidth: this.headerRef.current.clientWidth })
        }
    }

    render() {
        const columns = this.props.children.filter(item => item.type === Column)
        const showOverflowTooltipList = columns.filter(item => item.props.showOverflowTooltip).map(item =>{
            return item.props.dataIndex
        })

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
        const selectedKeyLength = Object.keys(selectedKeyMap).length


        let rowSelections = []
        if (this.props.rowSelection && this.props.rowSelection.selections) {
            rowSelections = this.props.rowSelection.selections
        }
        const headerCheckboxDropdownMenu = (
            <Menu>
                {
                    rowSelections.map((item, index) => {
                        if (item === Table.SELECTION_ALL) {
                            return <Menu.Item onClick={this.onCheckboxSelectAll} key={index}>全选所有</Menu.Item>
                        } else if (item === Table.SELECTION_INVERT) {
                            return <Menu.Item onClick={this.onCheckboxSelectInvert} key={index}>反选当页</Menu.Item>
                        }
                        return <Menu.Item onClick={item.onSelect} key={index}>{item.title}</Menu.Item>
                    })
                }
            </Menu>
        )
        return (
            <div className="ant-table ant-table-small" >
                <div className="ant-table-container">
                    <div className="ant-table-content">
                        <Spin spinning={this.props.loading}>
                            <div className="table">
                                <div className="ant-table-thead" style={{ height: this.props.itemSize }} ref={this.headerRef}>
                                    {!this.props.rowSelection ? null : (
                                        <div className="ant-table-cell ant-table-selection-column">
                                            <Checkbox
                                                onClick={this.onHeaderCheckboxClick}
                                                checked={selectedKeyLength === this.props.dataSource.length && selectedKeyLength > 0}
                                                isIndeterminate={selectedKeyLength > 0 && selectedKeyLength !== this.props.dataSource.length}
                                            />
                                            {
                                                rowSelections.length === 0 ? null : (
                                                    <div className="table-selection-extra">
                                                        <Dropdown overlay={headerCheckboxDropdownMenu}>
                                                            <span>
                                                                <DownOutlined />
                                                            </span>
                                                        </Dropdown>
                                                    </div>
                                                )
                                            }
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
                                                                let itemRenderWith = getSpanWidth(String(itemRender))
                                                                if (columnProps.render) {
                                                                    itemRender = columnProps.render(itemRender, rowData, index)
                                                                }
                                                                return (
                                                                    <div key={columnIndex} className="ant-table-cell" style={style}>
                                                                        {
                                                                            ((itemRender)=>{
                                                                                //TODO 获取showOverflowTooltipList column 的宽度
                                                                                if(showOverflowTooltipList.indexOf(columnProps.dataIndex)>=0 && itemRenderWith > 280) {
                                                                                    return (
                                                                                        <Tooltip title={itemRender} placement="right">
                                                                                            <div className="row-vertical">
                                                                                                {itemRender}
                                                                                            </div>
                                                                                        </Tooltip>
                                                                                    )
                                                                                } else {
                                                                                    return (
                                                                                        <div className="row-vertical">
                                                                                            {itemRender}
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                                
                                                                                
                                                                            })(itemRender)
                                                                        }
                                                                        
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
                        </Spin>
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
            onChange: propTypes.func,
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
