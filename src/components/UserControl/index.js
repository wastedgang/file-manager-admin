import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Dropdown, Menu, Form, Input, message } from 'antd'
import { DownOutlined, LogoutOutlined, UserOutlined, LockOutlined } from '@ant-design/icons'
import { ModalForm } from '@/components'
import { logout, refreshCurrentUserinfo } from '@/actions/user'
import axios from 'axios'

const mapState = state => ({
    ...state.user
})
@connect(mapState, { logout, refreshCurrentUserinfo })
@withRouter
class UserControl extends Component {
    state = {
        isUpdateUserModalVisible: false,
        isUpdatePasswordModalVisible: false,
    }

    componentDidMount() {
        this.props.refreshCurrentUserinfo()
    }

    // 退出登录
    onLogout = () => {
        this.props.logout()
        this.props.history.push('/login')
    }

    // 更新用户信息
    handleUpdateUserInfo = async ({ nickname, remark }) => {
        try {
            const requestData = { nickname: nickname, remark: remark }
            const response = await axios.put('/api/v1/current_user/info', requestData)
            if (response.data.code === '000000') {
                this.props.refreshCurrentUserinfo()
                message.success('修改成功')
                this.setState({ isUpdateUserModalVisible: false })
                return
            }
        } catch (err) {
            message.error('修改失败')
        }
    }

    // 修改用户密码
    handleUpdateUserPassword = async ({ oldPassword, newPassword }) => {
        try {
            const requestData = { old_password: oldPassword, new_password: newPassword }
            const response = await axios.patch('/api/v1/current_user/password', requestData)
            if (response.data.code === '000000') {
                message.success('修改成功')
                this.setState({ isUpdatePasswordModalVisible: false })
                return
            }
        } catch (err) {
            console.log(err)
            message.error('修改失败')
        }
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item icon={<UserOutlined />} onClick={() => this.setState({ isUpdateUserModalVisible: true })}>个人设置</Menu.Item>
                <Menu.Item icon={<LockOutlined />} onClick={() => this.setState({ isUpdatePasswordModalVisible: true })}>修改密码</Menu.Item>
                <Menu.Item icon={<LogoutOutlined />} onClick={this.onLogout}>退出登录</Menu.Item>
            </Menu>
        )
        return (
            this.props.isLogin ?
                (
                    <Fragment>
                        <div>
                            <Dropdown overlay={menu} trigger={['hover']}>
                                <div style={{cursor:'pointer'}}>
                                    你好，{this.props.userInfo.nickname ? this.props.userInfo.nickname : this.props.userInfo.username} <DownOutlined />
                                </div>
                            </Dropdown>
                        </div>

                        {/* {编辑用户信息对话框} */}
                        <ModalForm
                            title="编辑用户信息"
                            visible={this.state.isUpdateUserModalVisible}
                            onCancel={() => this.setState({ isUpdateUserModalVisible: false })}
                            onFinish={this.handleUpdateUserInfo}
                            initialValues={this.props.userInfo}
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
                            initialValues={this.props.userInfo}
                        >
                            <Form.Item
                                name="username"
                                label="用户名"
                            >
                                <Input placeholder="用户名" disabled={true} />
                            </Form.Item>
                            <Form.Item
                                name="oldPassword"
                                label="原密码"
                                rules={[{ required: true, message: '请输入原密码' }]}
                            >
                                <Input.Password placeholder="原密码" autoFocus={true} />
                            </Form.Item>
                            <Form.Item
                                name="newPassword"
                                label="新密码"
                                rules={[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码长度不少于6个字符' }]}
                            >
                                <Input.Password placeholder="新密码" />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                label="确认密码"
                                rules={[{ required: true, message: '请输入确认密码' }, ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve()
                                        }

                                        return Promise.reject('两次密码不一致')
                                    },
                                })]}
                            >
                                <Input.Password placeholder="确认密码" />
                            </Form.Item>
                        </ModalForm>
                    </Fragment>
                ) : (
                    <div>你好，游客&nbsp; <Link to="/login">去登录</Link></div>
                )
        )
    }
}

export default UserControl