import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';

import { routes } from './config'
import './index.less'

render(
    <ConfigProvider locale={zhCN}>
        <Router>
            <Switch>
                {
                    routes.map((routeInfo) => {
                        return (
                            <Route path={routeInfo.path} key={routeInfo.path} render={(props) => {
                                // TODO: 权限，需要登录
                                return <routeInfo.component {...props} route={routeInfo} />
                            }}>
                            </Route>
                        )
                    })
                }
                <Redirect to="/admin" from="/" exact />
                <Redirect to="/404" />
            </Switch>
        </Router>
    </ConfigProvider>,
    document.querySelector('#root')
)