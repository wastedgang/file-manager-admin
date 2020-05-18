import React, { Component } from 'react'

import { Card } from 'antd'

import { ContainerOutlined, DatabaseOutlined } from '@ant-design/icons'
import StoreDirectory from './StoreDirectory'
import DatabaseSetting from './DatabaseSetting'

const tabList = [
    {
        key: 'storeDirectory',
        tab: <div><ContainerOutlined />存储空间管理</div>,
        content: <StoreDirectory />
    },
    {
        key: 'database',
        tab: <div><DatabaseOutlined />数据库信息</div>,
        content: <DatabaseSetting />,
    },
]

export default class SystemSettings extends Component {
    state = {
        cardTabKey: tabList[0].key
    }

    onTabChange = (key, type) => {
        console.log(key, type)
        this.setState({ [type]: key })
    }

    render() {
        const currentTabInfo = tabList.filter((item) => item.key === this.state.cardTabKey)[0]
        return (
            <Card
                // style={{ width: '100%' }}
                tabList={tabList}
                activeTabKey={this.state.cardTabKey}
                onTabChange={key => {
                    this.onTabChange(key, 'cardTabKey')
                }}
                bordered={false}
            >
                {currentTabInfo.content}
            </Card>
        )
    }
}
