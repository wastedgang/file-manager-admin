import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';

import store from '@/store'
import '@/config/axios'

import './index.less'
import App from './App'


render(
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
            <Router>
                <App/>
            </Router>
        </ConfigProvider>
    </Provider>,
    document.querySelector('#root')
)