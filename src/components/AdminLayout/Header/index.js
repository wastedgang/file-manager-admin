import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Dropdown, Menu, Divider, Popover } from 'antd'
import { DownOutlined, LogoutOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { logout } from '@/actions/user'
import { UploadTaskList } from '@/components'

import './header.less'
import headerLogo from './header-logo.png'

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

                {
                    !this.props.isLogin ? null : (
                        <Fragment>
                            <div>
                                <Popover content={<UploadTaskList />} placement="bottomRight" trigger="click">
                                    <UnorderedListOutlined />&nbsp;&nbsp;上传记录
                                </Popover>
                            </div>

                            <div>
                                <Divider type="vertical" />
                            </div>
                        </Fragment>
                    )
                }

                <div>
                    {
                        this.props.isLogin ?
                            (
                                <Dropdown overlay={menu} trigger={['hover']}>
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