import React, { Component } from 'react'
import { Button, Form, Input, Card } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import './login.less'

export default class Login extends Component {
    formRef = React.createRef()

    onLogin = ({ username, password }) => {
        console.log(username, password)
    }

    render() {
        return (
            <Card
                title={<div style={{ fontSize: 14, padding: '5px 0' }}>家庭文件管理系统登录</div>}
                className="login-wrapper"
            >
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onLogin}
                    size="large"
                >
                    <Form.Item
                        name="username"
                        style={{marginTop: 12}}
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        style={{marginTop: 24}}
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>

                    <Form.Item style={{marginTop: 24}}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>登录</Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}
