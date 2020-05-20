import React, { Component } from 'react'
import { Button, Form, Input, Radio } from 'antd'

import { ContentCard } from '@/components'

export default class DatabaseSetting extends Component {
    formRef = React.createRef()

    state = {
        type: 'SQLite'
    }

    onUpdateDatabaseSetting = (values) => {
        console.log(values)
        // this.props.onFinish(values, this.props.extra ? this.props.extra : null)
    }

    render() {
        return (
            <ContentCard
                title="数据库信息"
                description="初始化、查看数据库信息"
            >
                <Form
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 8 }}
                    ref={this.formRef}
                    onFinish={this.onUpdateDatabaseSetting}
                    style={{ marginTop: 30 }}
                >
                    <Form.Item label="数据库类型" name="type" initialValue={this.state.type}>
                        <Radio.Group onChange={(event) => { this.setState({ type: event.target.value }) }}>
                            <Radio.Button value="SQLite">SQLite</Radio.Button>
                            <Radio.Button value="MySQL">MySQL</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {
                        (() => {
                            if (this.state.type === 'MySQL') {
                                return [(
                                    <Form.Item
                                        key="address"
                                        name="address"
                                        label="地址"
                                        rules={[
                                            { required: true, message: '请输入地址' },
                                            { pattern: /([^/:]+)(:\d*)?/, message: '请提供正确的地址' }
                                        ]}
                                    >
                                        <Input placeholder="地址" ref={input => { input && input.focus() }} />
                                    </Form.Item>
                                ), (
                                    <Form.Item
                                        key="database"
                                        name="database"
                                        label="数据库名"
                                        rules={[{ required: true, message: '请输入数据库名' }]}
                                    >
                                        <Input placeholder="数据库名" />
                                    </Form.Item>
                                ), (
                                    <Form.Item
                                        key="username"
                                        name="username"
                                        label="用户名"
                                        rules={[{ required: true, message: '请输入用户名' }]}
                                    >
                                        <Input placeholder="用户名" />
                                    </Form.Item>
                                ), (
                                    <Form.Item
                                        key="password"
                                        name="password"
                                        label="密码"
                                        rules={[{ required: true, message: '请输入密码' }]}
                                    >
                                        <Input.Password placeholder="密码" />
                                    </Form.Item>
                                )]
                            } else {
                                return [(
                                    <Form.Item
                                        key="database"
                                        name="database"
                                        label="数据库文件名"
                                        rules={[{ required: true, message: '请输入数据库文件名' }]}
                                    >
                                        <Input placeholder="数据库文件名" ref={input => { input && input.focus() }} />
                                    </Form.Item>
                                ), (
                                    <Form.Item
                                        key="password"
                                        name="password"
                                        label="密码"
                                    >
                                        <Input.Password placeholder="密码" />
                                    </Form.Item>
                                )]
                            }
                        })()
                    }
                    <Form.Item wrapperCol={{ span: 8, offset: 10 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </Form.Item>
                </Form>
            </ContentCard>
        )
    }
}
