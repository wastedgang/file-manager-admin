import React from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import './message-box.less'

export default class MessageBox {
    static show(type, options) {
        if (options.icon) {
            if (options.title && !options.content) {
                options.content = options.title
                options.title = null
            }
            if (!options.title && options.content && typeof options.content === 'string') {
                const icon = options.icon
                options.content = (
                    <div className="messagebox-icon-content">
                        {icon}
                        <div className="messagebox-icon-content-text">{options.content}</div>
                    </div>
                )
                options.icon = null
            }
        }
        return new Promise((resolve, reject) => {
            Modal[type]({
                ...options,
                onOk: () => {
                    new Promise((res) => {
                        resolve()
                        res()
                    })
                },
                onCancel: () => {
                    new Promise((res) => {
                        reject()
                        res()
                    })
                },
            })
        })
    }

    static dangerConfirm(options) {
        if (options.okType === undefined) {
            options.okType = 'danger'
        }

        options.icon = options.icon ? options.icon : <ExclamationCircleOutlined />
        return MessageBox.show('confirm', options)
    }

    static info(options) {
        return MessageBox.show('info', options)
    }

    static success(options) {
        return MessageBox.show('success', options)
    }

    static error(options) {
        return MessageBox.show('error', options)
    }

    static warning(options) {
        return MessageBox.show('warning', options)
    }

    static confirm(options) {
        return MessageBox.show('confirm', options)
    }
}
