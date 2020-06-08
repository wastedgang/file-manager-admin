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

String.prototype.width = function getSpanWidth(str) {
    var width = 0;
    var html = document.createElement('span');
    html.innerText = str;
    html.className = 'getTextWidth';
    document.querySelector('body').appendChild(html);
    width = document.querySelector('.getTextWidth').offsetWidth;
    document.querySelector('.getTextWidth').remove();
    return width;
}


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