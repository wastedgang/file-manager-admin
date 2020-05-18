import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';

import { mainRoutes } from '@/routes'
import App from '@/App'
import './index.less'

render(
    <ConfigProvider locale={zhCN}>
        <Router>
            <Switch>
                <Route path="/admin" render={(props) => {
                    // TODO: 权限，需要登录
                    return <App {...props} />
                }} />
                {
                    mainRoutes.map(route => {
                        return <Route key={route.path} path={route.path} component={route.component} />
                    })
                }
                <Redirect to="/admin" from="/" exact />
                <Redirect to="/404" />
            </Switch>
        </Router>
    </ConfigProvider>,
    document.querySelector('#root')
)