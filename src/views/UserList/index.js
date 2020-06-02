import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Button, Space, Input, Form, message } from 'antd'
import { UserAddOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons'

import { ModalForm, MessageBox, TableCard, Table } from '@/components'
import { refreshCurrentUserinfo } from '@/actions/user'

const mapState = state => ({
    ...state.user
})
@connect(mapState, { refreshCurrentUserinfo })
class UserList extends Component {
    state = {
        isAddUserModalVisible: false,

        isUpdateUserModalVisible: false,
        isUpdatePasswordModalVisible: false,
        selectedUser: {},
        selectedUserIndex: null,
        users: [],
    }

    handleAddUser = async ({ username, remark }) => {
        // 添加用户
        try {
            const response = await axios.post('/api/v1/user', { username: username, remark: remark })
            if (response.data.code === '000000') {
                this.refreshUserList()
                message.success('添加成功')
                this.setState({ isAddUserModalVisible: false })
                return
            }
        } catch (err) {
            message.error('添加失败')
        }
    }

    // 编辑用户信息
    handleUpdateUserInfo = async ({ nickname, remark }) => {
        // 更新用户信息
        try {
            const requestData = { nickname: nickname, remark: remark }
            const response = await axios.put('/api/v1/user/' + this.state.selectedUser.username + '/info', requestData)
            if (response.data.code === '000000') {
                this.refreshUserList()
                message.success('修改成功')
                this.setState({ isUpdateUserModalVisible: false })
                if (this.state.selectedUser.username === this.props.userInfo.username) {
                    this.props.refreshCurrentUserinfo()
                }
                return
            }
        } catch (err) {
            message.error('修改失败')
        }
    }

    // 修改用户密码
    handleUpdateUserPassword = async ({ password }) => {
        try {
            const requestData = { password: password }
            const response = await axios.patch('/api/v1/user/' + this.state.selectedUser.username + '/password', requestData)
            if (response.data.code === '000000') {
                this.refreshUserList()
                message.success('修改成功')
                this.setState({ isUpdatePasswordModalVisible: false })
                return
            }
        } catch (err) {
            message.error('修改失败')
        }
    }

    // 删除用户信息
    handleDeleteUser = async (userInfo, index) => {
        try {
            await MessageBox.dangerConfirm({ content: '是否确定删除该用户？' })
        } catch (err) {
            return
        }

        // 删除用户
        try {
            const response = await axios.delete('/api/v1/user/' + userInfo.username)
            if (response.data.code === '000000') {
                message.success('删除成功')
                this.refreshUserList()
                return
            }
        } catch (err) {
            message.error('删除失败')
        }
    }

    // 刷新用户列表
    refreshUserList = async () => {
        try {
            const response = await axios.get('/api/v1/users')
            if (response.data.code && response.data.code === '000000') {
                this.setState({ users: response.data.data.users })
            }
        } catch (err) {
            message.error('获取用户列表失败')
        }
    }

    componentDidMount = () => {
        this.refreshUserList()
    }

    render() {
        return (
            <>
                <TableCard
                    title="用户列表"
                    description="可查看添加、编辑、删除用户信息"
                    extra={<Button icon={<UserAddOutlined />} onClick={() => this.setState({ isAddUserModalVisible: true })}>添加用户</Button>}

                    dataSource={this.state.users}
                    pagination={false}
                    rowKey='username'
                >
                    <Table.Column title="用户名" dataIndex="username" />
                    <Table.Column title="昵称" dataIndex="nickname" />
                    <Table.Column
                        title="用户类型"
                        render={(text, record, index) => {
                            switch (record.type) {
                                case 'SYSTEM_ADMIN':
                                    return '管理员'
                                case 'NORMAL':
                                    return '普通用户'
                                default:
                                    return '未知用户类型'
                            }
                        }}
                    />
                    <Table.Column title="备注" dataIndex="remark" />
                    <Table.Column title="创建时间" dataIndex="createTime" />
                    <Table.Column
                        title="操作"
                        render={(text, record, index) => (
                            <Space size="middle">
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={
                                        () => this.setState({ isUpdateUserModalVisible: true, selectedUser: record, selectedUserIndex: index })
                                    }
                                >
                                    <EditOutlined />编辑
                                </Button>
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={
                                        () => this.setState({ isUpdatePasswordModalVisible: true, selectedUser: record, selectedUserIndex: index })
                                    }
                                >
                                    <LockOutlined />修改密码
                                </Button>
                                <Button size="small" danger onClick={() => this.handleDeleteUser(record, index)}><DeleteOutlined />删除</Button>
                            </Space>
                        )}
                    />

                </TableCard>

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
                        rules={[
                            { required: true, message: '请输入用户名' },
                            { pattern: /^[0-9A-Za-z_]{5,32}$/, message: '用户名必须由数字、英文字母和下划线组成，且长度为6~32个字符' },
                        ]}
                    >
                        <Input placeholder="用户名" autoFocus={true} />
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
                    onFinish={this.handleUpdateUserInfo}
                    initialValues={this.state.selectedUser}
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                    >
                        <Input placeholder="用户名" disabled={true} />
                    </Form.Item>
                    <Form.Item
                        name="nickname"
                        label="昵称"
                        rules={[{ required: true, message: '请输入昵称' }]}
                    >
                        <Input placeholder="昵称" autoFocus={true} />
                    </Form.Item>
                    <Form.Item
                        name="remark"
                        label="备注"
                    >
                        <Input.TextArea placeholder="备注" />
                    </Form.Item>
                </ModalForm>

                {/* {修改用户密码对话框} */}
                <ModalForm
                    title="修改用户密码"
                    visible={this.state.isUpdatePasswordModalVisible}
                    onCancel={() => this.setState({ isUpdatePasswordModalVisible: false })}
                    onFinish={this.handleUpdateUserPassword}
                    initialValues={this.state.selectedUser}
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                    >
                        <Input placeholder="用户名" disabled={true} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="新密码"
                        rules={[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码长度不少于6个字符' }]}
                    >
                        <Input.Password placeholder="新密码" autoFocus={true} />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="确认密码"
                        rules={[{ required: true, message: '请输入确认密码' }, ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve()
                                }

                                return Promise.reject('两次密码不一致')
                            },
                        })]}
                    >
                        <Input.Password placeholder="确认密码" />
                    </Form.Item>
                </ModalForm>
            </>
        )
    }
}

export default UserList