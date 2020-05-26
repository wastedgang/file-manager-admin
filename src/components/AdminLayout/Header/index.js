import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Dropdown, Menu } from 'antd'
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'

import './header.less'
import headerLogo from './header-logo.png'
import { logout } from '@/actions/user'

const mapState = state => ({
    ...state.user
})

@connect(mapState, { logout })
@withRouter
class Header extends Component {
    // 退出登录
    onLogout = () => {
        this.props.logout()
        this.props.history.push('/login')
    }

    // 个人信息设置
    onPersonalSettings = () => {
        console.log('onPersonalSettings')
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item icon={<UserOutlined />} onClick={this.onPersonalSettings}>个人设置</Menu.Item>
                <Menu.Item icon={<LogoutOutlined />} onClick={this.onLogout}>退出登录</Menu.Item>
            </Menu>
        )
        return (
            <Layout.Header className="admin-header">
                <div className="admin-header-logo">
                    <img src={headerLogo} alt="warehouse" />
                </div>

                <div>
                    {
                        this.props.isLogin ?
                            (<Dropdown overlay={menu}>
                                <div>
                                    你好，{this.props.userInfo.nickname ? this.props.userInfo.nickname : this.props.userInfo.username} <DownOutlined />
                                </div>
                            </Dropdown>

                            ) : (
                                <div>你好，游客&nbsp; <Link to="/login">去登录</Link></div>
                            )
                    }
                </div>
            </Layout.Header>
        )
    }
}

export default Header