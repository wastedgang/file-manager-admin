import React, { Component } from 'react'

import { UserAddOutlined } from '@ant-design/icons'
import { Button, Table, Space, Input, Form } from 'antd'

import { TableCard, ModalForm, MessageBox } from '@/components'

const mockUserList = [{
    id: 1,
    username: 'admin',
    nickname: '',
    type: 'ADMIN',
    createTime: '2020-05-17 04:50:00'
},
{
    id: 2,
    username: 'admin',
    nickname: '',
    type: 'ADMIN',
    createTime: '2020-05-17 04:50:00'
}]

export default class UserList extends Component {
    state = {
        isAddUserModalVisible: false,

        isUpdateUserModalVisible: false,
        selectedUser: {},
        selectedUserIndex: null,
    }

    handleAddUser = ({ username, remark }) => {
        // TODO: 添加用户
        this.setState({ isAddUserModalVisible: false })
    }

    // 编辑用户信息
    handleUpdateUser = ({ nickname, remark }) => {
        // TODO: 更新用户信息
        this.setState({ isUpdateUserModalVisible: false })
    }

    // 删除用户信息
    handleDeleteUser = async (userInfo, index) => {
        try {
            await MessageBox.dangerConfirm({ content: '是否确认删除该用户？' })
        } catch (err) {
            return
        }
        // TODO: 删除用户
    }

    render() {
        return (
            <TableCard
                title="用户列表"
                description="可添加、删除用户"
                extra={<Button icon={<UserAddOutlined />} onClick={() => this.setState({ isAddUserModalVisible: true })}>添加用户</Button>}
            >
                <Table dataSource={mockUserList} pagination={false} rowKey='id' size="small">
                    <Table.Column title="用户名" dataIndex="username" key="username" align="center" />
                    <Table.Column title="昵称" dataIndex="nickname" key="nickname" align="center" />
                    <Table.Column title="用户类型" dataIndex="type" key="type" align="center" />
                    <Table.Column title="备注" dataIndex="remark" key="remark" align="center" />
                    <Table.Column title="创建时间" dataIndex="createTime" key="createTime" align="center" />
                    <Table.Column
                        title="操作"
                        key="action"
                        align="center"
                        render={(text, record, index) => (
                            <Space size="middle">
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={
                                        () => this.setState({ isUpdateUserModalVisible: true, selectedUser: record, selectedUserIndex: index })
                                    }
                                >
                                    编辑
                                </Button>
                                <Button size="small" danger onClick={() => this.handleDeleteUser(record, index)}>删除</Button>
                            </Space>
                        )}
                    />
                </Table>

                {/* {添加用户对话框} */}
                <ModalForm
                    title="添加用户"
                    visible={this.state.isAddUserModalVisible}
                    onCancel={() => this.setState({ isAddUserModalVisible: false })}
                    onFinish={this.handleAddUser}
                    initialValues={{ username: '', remark: '' }}
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input placeholder="用户名" ref={input => { input && input.focus() }} />
                    </Form.Item>
                    <Form.Item
                        name="remark"
                        label="备注"
                    >
                        <Input.TextArea placeholder="备注" />
                    </Form.Item>
                </ModalForm>

                {/* {编辑用户信息对话框} */}
                <ModalForm
                    title="编辑用户信息"
                    visible={this.state.isUpdateUserModalVisible}
                    onCancel={() => this.setState({ isUpdateUserModalVisible: false })}
                    onFinish={this.handleUpdateUser}
                    initialValues={this.state.selectedUser}
                >
                    <Form.Item
                        name="nickname"
                        label="昵称"
                        rules={[{ required: true, message: '请输入昵称' }]}
                    >
                        <Input placeholder="昵称" ref={input => { input && input.focus() }} />
                    </Form.Item>
                    <Form.Item
                        name="remark"
                        label="备注"
                    >
                        <Input.TextArea placeholder="备注" />
                    </Form.Item>
                </ModalForm>
            </TableCard>
        )
    }
}
