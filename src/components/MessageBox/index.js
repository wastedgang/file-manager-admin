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
            if (!options.title && options.content && (typeof options.content === 'string' || options.content.map)) {
                const icon = options.icon

                let content = []
                if (typeof options.content === 'string') {
                    content = options.content
                } else {
                    for (let i = 0; i < options.content.length; i++) {
                        content.push(options.content[i])
                        if (i < options.content.length - 1 && typeof options.content[i] === 'string' && typeof options.content[i + 1] === 'string') {
                            content.push(<br key={1589926444878 + i} />)
                        }
                    }
                }
                options.content = (
                    <div className="messagebox-icon-content">
                        {icon}
                        <div className="messagebox-icon-content-text">{content}</div>
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
