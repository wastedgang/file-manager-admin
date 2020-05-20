import React, { Component } from 'react'
import { withRouter, Redirect, Route, Switch } from 'react-router-dom'

import headerLogo from './admin-header-logo.png'
import './admin-layout.less'

import { Layout, Menu } from 'antd'
import PropTypes from 'prop-types'

const { Header, Content, Sider } = Layout

@withRouter
class AdminLayout extends Component {
    onMenuClick = ({ key }) => {
        if (this.props.location.pathname !== key) {
            this.props.history.push(key)
        }
    }

    // 计算菜单组件
    getMenuList = (routeInfo) => {
        if (!routeInfo) {
            routeInfo = this.props.route
        }

        if (!routeInfo.children || !routeInfo.children.map) {
            return (
                <Menu.Item key={routeInfo.path} icon={<routeInfo.menu.icon />}>
                    <span>{routeInfo.title}</span>
                </Menu.Item>
            )
        }

        return routeInfo.children.map(route => {
            let menuRoutes = []
            if (route.children && route.children.length && route.children.filter) {
                menuRoutes = route.children.filter(item => item.menu)
            }

            if (menuRoutes.length) {
                return (
                    <Menu.SubMenu key={route.path} icon={<route.menu.icon />} title={route.title}>
                        {menuRoutes.map(menuRoute => this.getMenuList(menuRoute))}
                    </Menu.SubMenu>
                )
            } else {
                return (
                    <Menu.Item key={route.path} icon={<route.menu.icon />}>
                        <span>{route.title}</span>
                    </Menu.Item>
                )
            }
        })
    }

    // 计算Route列表
    getRouteList = (routeInfo) => {
        if (!routeInfo) {
            routeInfo = this.props.route
        }

        let routeList = []
        // 有子级路由的页面默认跳转 路由信息redirect，若无redirect信息则跳转首页
        if (routeInfo.children && routeInfo.children.length && routeInfo.children.map) {
            routeList.push((
                <Redirect key={routeInfo.path} to={routeInfo.redirect ? routeInfo.redirect : '/'} from={routeInfo.path} exact />
            ))
        }
        // 无子级路由的页面
        else {
            routeList.push((
                <Route path={routeInfo.path} key={routeInfo.path} render={(props) => {
                    // TODO: 权限，需要登录
                    return <routeInfo.component {...props} route={routeInfo} />
                }} />
            ))
        }

        // 若有子级路由则递归处理子级路由
        if (routeInfo.children && routeInfo.children.length) {
            for (let childRoute of routeInfo.children) {
                routeList = [
                    ...routeList,
                    ...(this.getRouteList(childRoute))
                ]
            }
        }
        return routeList
    }

    // 计算
    getMenuSelectedKeys = () => {
        const names = this.props.location.pathname.split('/')
        const selectedKeys = []
        for (let i = 1; i < names.length; i++) {
            selectedKeys.push(names.slice(0, i + 1).join('/'))
        }
        return ['/', ...selectedKeys]
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
                    <Sider width={175}>
                        <Menu
                            mode="inline"
                            selectedKeys={this.getMenuSelectedKeys()}
                            style={{ height: '100%', borderRight: 0 }}
                            onClick={this.onMenuClick}
                            defaultOpenKeys={this.getMenuSelectedKeys()}
                        >
                            {
                                this.getMenuList()
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
                            <Switch>
                                {this.getRouteList(this.props.route)}
                                <Redirect to="/404" />
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }

    static propTypes = {
        route: PropTypes.shape({
            redirect: PropTypes.string.isRequired,
            children: PropTypes.array.isRequired,
        })
    }
}

export default AdminLayout