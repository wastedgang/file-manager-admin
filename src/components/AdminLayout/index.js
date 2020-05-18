import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import headerLogo from './admin-header-logo.png'
import './admin-layout.less'

import { Layout, Menu } from 'antd'

const { Header, Content, Sider } = Layout

@withRouter
class AdminLayout extends Component {
    onMenuClick = ({ key }) => {
        if (this.props.location.pathname !== key) {
            this.props.history.push(key)
        }
    }

    render() {
        return (
            <Layout style={{ minHeight: '100%' }}>
                <Header className="admin-header">
                    <div className="admin-header-logo">
                        <img src={headerLogo} alt="warehouse" />
                    </div>
                </Header>
                <Layout>
                    <Sider width={200}>
                        <Menu
                            mode="inline"
                            selectedKeys={[this.props.location.pathname]}
                            style={{ height: '100%', borderRight: 0 }}
                            onClick={this.onMenuClick}
                        >
                            {
                                this.props.menus.map(route => {
                                    return (
                                        <Menu.Item key={route.path}>
                                            {<route.icon />}
                                            <span>{route.title}</span>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '16px' }}>
                        <Content
                            style={{
                                background: '#fff',
                                padding: 16,
                                paddingTop: 0,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default AdminLayout