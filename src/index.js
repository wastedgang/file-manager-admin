import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import { Provider } from 'react-redux'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';

import './index.less'
import { routes } from './config'
import store from './store'
import './requests'

render(
    <Provider store={store}>
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
        </ConfigProvider>
    </Provider>,
    document.querySelector('#root')
)