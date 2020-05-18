import React from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export default class MessageBox {
    static show(type, options) {
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
        if (options.icon === undefined) {
            options.icon = <ExclamationCircleOutlined />
        }
        if (options.okType === undefined) {
            options.okType = 'danger'
        }
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
